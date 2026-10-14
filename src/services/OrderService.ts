import { IOrderRepository } from '../repositories/IOrderRepository';
import { IPaymentMethod } from '../payments/IPaymentMethod';
import { NotificationService } from './NotificationService';
import { ProductFactory } from '../domain/ProductFactory';
import { ValidationError } from '../lib/errors';
import logger from '../lib/logger';

export class OrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private paymentMethods: Record<string, IPaymentMethod>,
    private notificationService: NotificationService
  ) {}

  async processOrder(body: any) {
    const { customer, items, paymentMethod, paymentDetails } = body ?? {};

    // 1. Validação
    if (typeof customer !== 'string' || !customer.includes('@')) {
      throw new ValidationError('E-mail do cliente inválido');
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Carrinho vazio');
    }

    // 2. Cálculo do total
    let totalAmount = 0;
    const productsDetails = [];

    for (const item of items) {
      if (!Number.isInteger(item?.productId) || !Number.isInteger(item?.quantity) || item.quantity <= 0) {
        throw new ValidationError('Item inválido: informe productId e quantity (inteiro maior que zero)');
      }

      const data = await this.orderRepository.findProductById(item.productId);
      if (!data) {
        throw new ValidationError(`Produto ${item.productId} não encontrado`);
      }

      const product = ProductFactory.createProduct(data);
      totalAmount += product.price * item.quantity + product.calculateFreight();
      productsDetails.push({ ...data, quantity: item.quantity });
    }

    // 3. Pagamento
    const payment = Object.hasOwn(this.paymentMethods, paymentMethod) ? this.paymentMethods[paymentMethod] : undefined;
    if (!payment) {
      throw new ValidationError('Método de pagamento não suportado');
    }
    payment.process(paymentDetails);

    // 4. Persistência
    const order = await this.orderRepository.createOrder({
      customer,
      items: JSON.stringify(productsDetails),
      total: totalAmount,
      status: 'confirmed',
    });

    // 5. Notificação: o pedido já foi salvo, então falha no e-mail não deve derrubar a requisição
    let emailPreview: string | false = false;
    try {
      emailPreview = await this.notificationService.sendOrderConfirmation(
        customer,
        order.id,
        totalAmount,
        productsDetails.map(p => p.name)
      );
    } catch (error: any) {
      logger.error(`Pedido #${order.id} salvo, mas falhou o envio do e-mail: ${error.message}`);
    }

    return { orderId: order.id, emailPreview };
  }
}

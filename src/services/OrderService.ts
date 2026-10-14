import { IOrderRepository } from '../repositories/IOrderRepository';
import { IPaymentMethod } from '../payments/IPaymentMethod';
import { NotificationService } from './NotificationService';
import { ProductFactory } from '../domain/ProductFactory';

// Erro de validação (vira HTTP 400 no controller)
export class OrderValidationError extends Error {}

export class OrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private paymentMethods: Record<string, IPaymentMethod>,
    private notificationService: NotificationService
  ) {}

  async processOrder(body: any) {
    const { customer, items, paymentMethod, paymentDetails } = body;

    // 1. Validação
    if (!items || items.length === 0) {
      throw new OrderValidationError('Carrinho vazio');
    }

    // 2. Cálculo do total
    let totalAmount = 0;
    const productsDetails = [];

    for (const item of items) {
      const data = await this.orderRepository.findProductById(item.productId);
      if (!data) {
        throw new OrderValidationError(`Produto ${item.productId} não encontrado`);
      }

      const product = ProductFactory.createProduct(data);
      totalAmount += product.price * item.quantity + product.calculateFreight();
      productsDetails.push({ ...data, quantity: item.quantity });
    }

    // 3. Pagamento
    const payment = this.paymentMethods[paymentMethod];
    if (!payment) {
      throw new OrderValidationError('Método de pagamento não suportado');
    }
    payment.process(paymentDetails);

    // 4. Persistência
    const order = await this.orderRepository.createOrder({
      customer,
      items: JSON.stringify(productsDetails),
      total: totalAmount,
      status: 'confirmed',
    });

    // 5. Notificação
    const emailPreview = await this.notificationService.sendOrderConfirmation(
      customer,
      order.id,
      totalAmount,
      productsDetails.map(p => p.name)
    );

    return { orderId: order.id, emailPreview };
  }
}

import { IMailProvider } from '../providers/IMailProvider';

export class NotificationService {
  constructor(private mailProvider: IMailProvider) {}

  async sendOrderConfirmation(customer: string, orderId: number, total: number, productNames: string[]) {
    return this.mailProvider.sendMail({
      to: customer,
      subject: `Confirmação do Pedido #${orderId}`,
      text: `Olá, seu pedido #${orderId} no valor de R$ ${total} foi confirmado.`,
      html: `
        <h1>Pedido Confirmado!</h1>
        <p>Olá, seu pedido <b>#${orderId}</b> foi processado com sucesso.</p>
        <p>Total: <strong>R$ ${total}</strong></p>
        <ul>
          ${productNames.map(name => `<li>${name}</li>`).join('')}
        </ul>
      `,
    });
  }
}

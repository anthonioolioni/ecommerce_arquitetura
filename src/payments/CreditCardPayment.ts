import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

export class CreditCardPayment implements IPaymentMethod {
  process(details: any): void {
    logger.info(`Processando cartão final ${details.cardNumber.slice(-4)}`);
    // Simulação de gateway
    if (details.cvv === '000') throw new Error('Cartão recusado');
  }
}

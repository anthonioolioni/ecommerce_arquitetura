import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';
import { ValidationError, PaymentDeclinedError } from '../lib/errors';

export class CreditCardPayment implements IPaymentMethod {
  process(details: any): void {
    if (!details || typeof details.cardNumber !== 'string' || typeof details.cvv !== 'string') {
      throw new ValidationError('Dados do cartão inválidos');
    }

    logger.info(`Processando cartão final ${details.cardNumber.slice(-4)}`);
    // Simulação de gateway
    if (details.cvv === '000') throw new PaymentDeclinedError('Cartão recusado');
  }
}

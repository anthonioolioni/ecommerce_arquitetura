import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';
import { ValidationError, PaymentDeclinedError } from '../lib/errors';

export class DebitCardPayment implements IPaymentMethod {
  process(details: any): void {
    if (!details || typeof details.cardNumber !== 'string' || typeof details.cvv !== 'string') {
      throw new ValidationError('Dados do cartão inválidos');
    }

    logger.info('Processando débito...');
    // Simulação de gateway
    if (details.cvv === '000') throw new PaymentDeclinedError('Cartão recusado');
  }
}

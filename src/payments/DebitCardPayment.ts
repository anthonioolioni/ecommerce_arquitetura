import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

export class DebitCardPayment implements IPaymentMethod {
  process(details: any): void {
    logger.info('Processando débito...');
  }
}

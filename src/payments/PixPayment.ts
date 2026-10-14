import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

export class PixPayment implements IPaymentMethod {
  process(details: any): void {
    logger.info('Processando Pix...');
  }
}

import { Request, Response } from 'express';
import logger from '../lib/logger';
import { OrderService } from '../services/OrderService';
import { ValidationError, PaymentDeclinedError } from '../lib/errors';

export class OrderController {
  constructor(private orderService: OrderService) {}

  processOrder = async (req: Request, res: Response) => {
    try {
      const result = await this.orderService.processOrder(req.body);
      logger.info(`Email enviado: ${result.emailPreview}`);

      return res.json({
        message: 'Pedido processado com sucesso',
        orderId: result.orderId,
        emailPreview: result.emailPreview,
      });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        logger.error(error.message);
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof PaymentDeclinedError) {
        logger.error(error.message);
        return res.status(402).json({ error: error.message });
      }
      logger.error(`Erro ao processar pedido: ${error.message}`);
      return res.status(500).json({ error: 'Erro interno' });
    }
  };
}

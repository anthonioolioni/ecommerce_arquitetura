import express from 'express';
import { OrderController } from './controllers/OrderController';
import { OrderService } from './services/OrderService';
import { NotificationService } from './services/NotificationService';
import { EtherealMailProvider } from './providers/EtherealMailProvider';
import { PrismaOrderRepository } from './repositories/PrismaOrderRepository';
import { CreditCardPayment } from './payments/CreditCardPayment';
import { DebitCardPayment } from './payments/DebitCardPayment';
import { PixPayment } from './payments/PixPayment';

const app = express();
app.use(express.json());

// Montagem das dependências
const orderService = new OrderService(
  new PrismaOrderRepository(),
  {
    credit_card: new CreditCardPayment(),
    debit_card: new DebitCardPayment(),
    pix: new PixPayment(),
  },
  new NotificationService(new EtherealMailProvider())
);
const orderController = new OrderController(orderService);

app.post('/orders', orderController.processOrder);

export default app;

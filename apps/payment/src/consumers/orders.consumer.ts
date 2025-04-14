import { Controller } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { PaymentService } from '../payment.service';

@Controller()
export class OrdersConsumer {
  constructor(private readonly paymentService: PaymentService) {}

  @RabbitRPC({
    exchange: 'orders',
    routingKey: 'payment.requested',
    queue: 'payment_orders_queue'
  })
  async handlePaymentRequest(event: {
    orderId: string;
    amount: number;
    userId: string;
  }) {
    await this.paymentService.processPayment(event.orderId, event.amount);
  }
}
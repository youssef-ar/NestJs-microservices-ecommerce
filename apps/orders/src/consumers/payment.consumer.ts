import { Controller } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { OrdersService } from '../orders.service';

@Controller()
export class PaymentConsumer {
  constructor(private readonly orders: OrdersService) {}

  @RabbitRPC({
    exchange: 'payments',
    routingKey: 'payment.processed',
    queue: 'orders_payment_queue'
  })
  async handlePaymentResult(event: { orderId: string; success: boolean }) {
    await this.orders.handlePaymentResult(event.orderId, event.success);
  }
}
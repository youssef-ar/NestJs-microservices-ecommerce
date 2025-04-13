import { Controller } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { OrdersService } from '../orders.service';

@Controller()
export class InventoryConsumer {
  constructor(private readonly orders: OrdersService) {}

  @RabbitRPC({
    exchange: 'inventory',
    routingKey: 'stock.reserved',
    queue: 'orders_inventory_queue'
  })
  async handleStockReserved(event: { orderId: string }) {
    await this.orders.handleStockReserved(event.orderId);
  }

  @RabbitRPC({
    exchange: 'inventory',
    routingKey: 'stock.reservation_failed',
    queue: 'orders_inventory_queue'
  })
  async handleStockReservationFailed(event: { orderId: string }) {
    await this.orders.handleOrderFailure(event.orderId);
  }
}

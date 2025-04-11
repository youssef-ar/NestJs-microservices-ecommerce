import { Controller } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { InventoryService } from '../inventory.service';

@Controller()
export class OrderConsumer {
  constructor(private readonly inventoryService: InventoryService) {}

  @RabbitRPC({
    exchange: 'orders',
    routingKey: 'order.created',
    queue: 'inventory_queue',
  })
  async handleOrderCreated(event: any) {
    await this.inventoryService.reserveStock(event);
  }

  @RabbitRPC({
    exchange: 'orders',
    routingKey: 'order.failed',
    queue: 'inventory_queue',
  })
  async handleOrderFailed(event: any) {
    await this.inventoryService.releaseStock(event);
  }
}
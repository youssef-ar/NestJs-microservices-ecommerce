import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RedisService } from './redis/redis.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly amqpConnection: AmqpConnection,
    private readonly redis: RedisService,
  ) {}

  async reserveStock(orderEvent: any) {
    const { orderId, items } = orderEvent;
    
    // Idempotency check
    const processed = await this.redis.get(`order:${orderId}`);
    if (processed) return;
    
    try {
      await this.prisma.$transaction(async (tx) => {
        for (const item of items) {
          const inventory = await tx.inventory.update({
            where: { productId: item.productId },
            data: {
              available: { decrement: item.quantity },
              reserved: { increment: item.quantity },
            },
          });

          if (inventory.available < 0) {
            throw new Error(`Insufficient stock for product ${item.productId}`);
          }
        }

        await this.redis.set(`order:${orderId}`, 'processed', 'EX', 86400);
        this.amqpConnection.publish('inventory', 'stock.reserved', { orderId });
      });
    } catch (error) {
      this.logger.error(`Stock reservation failed: ${error.message}`);
      this.amqpConnection.publish('inventory', 'stock.reservation_failed', {
        orderId,
        reason: error.message,
      });
    }
  }

  async releaseStock(orderEvent: any) {
    const { orderId, items } = orderEvent;
    
    try {
      await this.prisma.$transaction(async (tx) => {
        for (const item of items) {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: {
              reserved: { decrement: item.quantity },
              available: { increment: item.quantity },
            },
          });
        }
      });
      this.logger.log(`Released stock for order ${orderId}`);
    } catch (error) {
      this.logger.error(`Stock release failed: ${error.message}`);
    }
  }

  async getStock(productId: number) {
    return this.prisma.inventory.findUnique({
      where: { productId },
    });
  }
  async adjustStock(productId: number, newAvailable: number) {
    try {
      return await this.prisma.inventory.update({
        where: { productId },
        data: { available: newAvailable },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          this.logger.warn(`Inventory not found for product ${productId}`);
          throw new NotFoundException('Inventory record not found');
        }
      }
      this.logger.error(`Stock adjustment failed: ${error.message}`);
      throw new Error('Failed to adjust stock');
    }
  }
}
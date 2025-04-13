import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { HttpService } from '@nestjs/axios';
import { CreateOrderDto } from './dtos/create-order.dto';
import { RedisService } from './redis/redis.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly amqp: AmqpConnection,
    private readonly http: HttpService,
    //private readonly redis: RedisService
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Get cart items from Cart Service
      const { data: cart } = await this.http.axiosRef.get(
        `${process.env.CART_SERVICE_URL}/cart/${userId}`
      );

      if (!cart.items.length) {
        throw new Error('Cart is empty');
      }

      // 2. Create order record
      const order = await tx.order.create({
        data: {
          userId,
          total: cart.total,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });

      // 3. Publish order.created event
      this.amqp.publish('orders', 'order.created', {
        orderId: order.id,
        items: cart.items,
        userId
      });

      return order;
    });
  }

  async handlePaymentResult(orderId: string, success: boolean) {
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: success ? 'CONFIRMED' : 'FAILED'
      }
    });
    // get userId from order
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    const userId = order.userId;
    if (success) {
      // Clear cart
      await this.http.axiosRef.delete(
        `${process.env.CART_SERVICE_URL}/cart/${userId}`
      );
    } else {
      // Publish compensation event
      this.amqp.publish('orders', 'order.failed', { orderId });
    }
  }

  async getOrder(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });
  }

  async handleStockReserved(orderId: string) {
    try {
      // 1. Update order status to AWAITING_PAYMENT
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'AWAITING_PAYMENT' }
      });

      // 2. Get order details
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true }
      });

      // 3. Initiate payment process
      this.amqp.publish('payments', 'payment.requested', {
        orderId,
        userId: order.userId,
        amount: order.total,
        items: order.items.map(item => ({
          productId: item.productId,
          price: item.price
        }))
      });

      this.logger.log(`Payment initiated for order ${orderId}`);
    } catch (error) {
      this.logger.error(`Failed to process stock reservation: ${error.message}`);
      await this.handleOrderFailure(orderId);
    }
  }

  async handleOrderFailure(orderId: string) {
    try {
      // 1. Update order status to FAILED
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'FAILED' }
      });

      // 2. Publish compensation event
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true }
      });

      this.amqp.publish('inventory', 'order.failed', {
        orderId,
        items: order.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      });

      this.logger.log(`Order ${orderId} failed - compensation initiated`);
    } catch (error) {
      this.logger.error(`Failed to handle order failure: ${error.message}`);
      // Critical error - should trigger alert
    }
  }
}
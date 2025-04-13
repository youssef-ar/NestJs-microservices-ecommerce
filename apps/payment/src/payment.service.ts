import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RedisService } from './redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly amqp: AmqpConnection,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  async processPayment(orderId: string, amount: number) {
    // Idempotency check
    const processed = await this.redis.get(`payment:${orderId}`);
    if (processed) {
      this.logger.warn(`Duplicate payment attempt for order ${orderId}`);
      return this.getPaymentStatus(orderId);
    }

    try {
      // Simulate payment gateway call
      const paymentResult = await this.callPaymentGateway(amount);
      
      const payment = await this.prisma.payment.upsert({
        where: { orderId },
        update: {
          status: paymentResult.success ? 'SUCCEEDED' : 'FAILED',
          referenceId: paymentResult.referenceId
        },
        create: {
          orderId,
          amount,
          status: paymentResult.success ? 'SUCCEEDED' : 'FAILED',
          referenceId: paymentResult.referenceId
        }
      });

      // Publish result
      this.amqp.publish('payments', 'payment.processed', {
        orderId,
        success: paymentResult.success
      });

      await this.redis.set(`payment:${orderId}`, payment.status, 'EX', 86400);

      return payment;
    } catch (error) {
      this.logger.error(`Payment processing failed: ${error.message}`);
      this.amqp.publish('payments', 'payment.processed', {
        orderId,
        success: false
      });
      throw error;
    }
  }

  private async callPaymentGateway(amount: number) {
    // Replace with real payment gateway integration
    const success = amount <= this.config.get('MAX_PAYMENT_AMOUNT');
    return {
      success,
      referenceId: success ? `PAY-${Date.now()}` : null
    };
  }

  async getPaymentStatus(orderId: string) {
    return this.prisma.payment.findUnique({
      where: { orderId }
    });
  }

}
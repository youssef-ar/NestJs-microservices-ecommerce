import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from './prisma/prisma.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from '../../redis/redis.module';
import { RedisModule } from './redis/redis.module';
import { OrdersConsumer } from './consumers/orders.consumer';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    RedisModule,
    ConfigModule.forRoot(),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        exchanges: [
          { name: 'payments', type: 'topic' },
          { name: 'orders', type: 'topic' }
        ],
        uri: config.get('RABBITMQ_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, OrdersConsumer],
})
export class PaymentModule {}
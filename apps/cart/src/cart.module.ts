import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        exchanges: [
          { name: 'users', type: 'topic' }
        ],
        uri: config.get<string>('RABBITMQ_URL') || 'amqp://localhost', 
        queues: [
          {
            name: 'cart_users_queue',
            exchange: 'users',
            routingKey: 'user.*'
          }
        ]
      }),
      inject: [ConfigService],
    }),
    
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}


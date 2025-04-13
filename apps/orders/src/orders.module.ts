import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from './prisma/prisma.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    HttpModule,
    ConfigModule.forRoot({envFilePath: './apps/orders/.env'}),
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const rabbitMqUrl = config.get<string>('RABBITMQ_URL');
        if (!rabbitMqUrl) {
          throw new Error('RABBITMQ_URL is not defined in the configuration');
        }
        return {
          exchanges: [
            { name: 'orders', type: 'topic' },
            { name: 'payments', type: 'topic' },
            { name: 'inventory', type: 'topic' }
          ],
          uri: config.getOrThrow<string>('RABBITMQ_URL'),
          connectionInitOptions: { wait: true }
        };
      },
      inject: [ConfigService],
    }),
    RedisModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
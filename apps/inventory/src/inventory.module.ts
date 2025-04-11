import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { PrismaModule } from './prisma/prisma.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot(),
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule,     RedisModule.forRoot()],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          { name: 'orders', type: 'topic' },
          { name: 'inventory', type: 'topic' },
        ],
        uri: configService.get<string>('RABBITMQ_URL') || 'amqp://localhost',
        connectionInitOptions: { wait: false },
      }),
      inject: [ConfigService],
    }),
    RedisModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
import { DynamicModule, Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({})
export class RedisModule {
  static forRoot(): DynamicModule {
    return {
      module: RedisModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: async (configService: ConfigService) => {
            const client = require('redis').createClient({
              url: configService.get('REDIS_URL'),
              pingInterval: 1000 * 60 * 4 // 4 minutes
            });
            await client.connect();
            return client;
          },
          inject: [ConfigService]
        },
        RedisService
      ],
      exports: [RedisService]
    };
  }
}
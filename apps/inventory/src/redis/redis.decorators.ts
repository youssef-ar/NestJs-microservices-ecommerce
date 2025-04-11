import { createParamDecorator } from '@nestjs/common';
import { RedisClientType } from 'redis';

export const InjectRedis = createParamDecorator((data?: string) => ({
  name: 'REDIS_CLIENT',
  transform: (client: RedisClientType) => {
    if (data && typeof client[data] === 'function') {
      return client[data].bind(client);
    }
    return client;
  }
}));
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { Inject } from '@nestjs/common';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(
    @Inject('REDIS_CLIENT') private readonly client: RedisClientType
  ) {}

  async onModuleDestroy() {
    await this.client.quit();
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    try {
      const options = ttl ? { EX: ttl } : undefined;
      await this.client.set(key, value, options);
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      return await this.client.ping() === 'PONG';
    } catch (error) {
      return false;
    }
  }
}
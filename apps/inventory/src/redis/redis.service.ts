import { Inject,Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { RedisClientType } from 'redis';
//import { InjectRedis } from './redis.decorators';


@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    //@InjectRedis() private readonly client: RedisClientType
    @Inject('REDIS_CLIENT') private readonly client: RedisClientType

  ) {}

  async onModuleDestroy() {
    await this.client.quit();
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(`Redis GET error: ${error.message}`);
      return null;
    }
  }

  async set(key: string, value: string, p0: string, ttl?: number): Promise<boolean> {
    try {
      const options = ttl ? { EX: ttl } : undefined;
      await this.client.set(key, value, options);
      return true;
    } catch (error) {
      this.logger.error(`Redis SET error: ${error.message}`);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      this.logger.error(`Redis DEL error: ${error.message}`);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const count = await this.client.exists(key);
      return count === 1;
    } catch (error) {
      this.logger.error(`Redis EXISTS error: ${error.message}`);
      return false;
    }
  }
}
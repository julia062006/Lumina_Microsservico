import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;
  private pub: Redis;
  private sub: Redis;

  constructor(cfg: ConfigService) {
    const host = cfg.get('REDIS_HOST', 'localhost');
    const port = parseInt(cfg.get('REDIS_PORT', '6379'));

    this.client = new IORedis({ host, port });
    this.pub = new IORedis({ host, port });
    this.sub = new IORedis({ host, port });

    this.client.on('connect', () => this.logger.log(`Conectado ao Redis ${host}:${port}`));
    this.client.on('error', (e) => this.logger.error(`Erro no Redis: ${e.message}`));
  }

  async onModuleDestroy() {
    await Promise.all([this.client.quit(), this.pub.quit(), this.sub.quit()]);
  }

  getClient() { return this.client; }
  getPublisher() { return this.pub; }
  getSubscriber() { return this.sub; }
}
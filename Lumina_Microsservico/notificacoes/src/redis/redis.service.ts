import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
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

    const clientes: Record<string, Redis> = {
      client: this.client,
      pub: this.pub,
      sub: this.sub,
    };

    for (const [nome, conexao] of Object.entries(clientes)) {
      conexao.on('connect', () =>
        this.logger.log(`[REDIS] Cliente "${nome}" conectado em ${host}:${port}`),
      );
      conexao.on('error', (e) =>
        this.logger.error(`[REDIS] Erro no cliente "${nome}": ${e.message}`),
      );
    }
  }

  async onModuleInit() {
    try {
      const resposta = await this.client.ping();
      this.logger.log(`[REDIS] PING -> ${resposta}`);
    } catch (error) {
      const mensagem = error instanceof Error
        ? error.message
        : String(error);

      this.logger.error(
        `[REDIS] Falha ao executar PING: ${mensagem}`,
      );

      throw error;
    }
  }

  async onModuleDestroy() {
    await Promise.all([this.client.quit(), this.pub.quit(), this.sub.quit()]);
  }

  getClient() { return this.client; }
  getPublisher() { return this.pub; }
  getSubscriber() { return this.sub; }
}
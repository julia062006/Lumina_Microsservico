import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { NotificationsService } from '../notifications/notifications.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LivroCadastradoEvent } from './dto/livro-cadastrado.event';

@Injectable()
export class EventsService implements OnModuleInit {
    private readonly logger = new Logger(EventsService.name);

    constructor(
        private redis: RedisService,
        private notifications: NotificationsService,
    ) { }

    async onModuleInit() {
        const sub = this.redis.getSubscriber();
        await sub.subscribe('livro.cadastrado');
        this.logger.log('Inscrito em: livro.cadastrado');

        sub.on('message', async (channel, raw) => {
            this.logger.log(`[PUBSUB] Mensagem recebida em "${channel}": ${raw}`);
            try {
                const payload = JSON.parse(raw);
                if (channel === 'livro.cadastrado') {
                    const evento = plainToInstance(LivroCadastradoEvent, payload);
                    const erros = await validate(evento);

                    if (erros.length > 0) {
                        this.logger.warn(`[PUBSUB] Evento inválido descartado: ${JSON.stringify(erros.map(e => e.constraints))}`);
                        return;
                    }

                    await this.notifications.processarNovoLivro(evento);
                }
            } catch (err) {
                this.logger.error(`[PUBSUB] Falha ao processar "${channel}": ${(err as Error).message}`);
            }
        });
    }
}
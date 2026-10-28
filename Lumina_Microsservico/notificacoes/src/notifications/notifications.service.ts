import { Injectable, Logger } from '@nestjs/common';
import { LivroCadastradoEvent } from '../events/livro-cadastrado.event';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async processarNovoLivro(livro: LivroCadastradoEvent): Promise<void> {
    this.logger.log(`Processando notificação do livro "${livro.titulo}"`);
  }
}
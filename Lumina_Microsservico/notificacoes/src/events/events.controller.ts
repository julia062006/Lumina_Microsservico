import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from '../notifications/notifications.service';
import { LivroCadastradoEvent } from './dto/livro-cadastrado.event';

@Controller()
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('livro.cadastrado')
  async handleLivroCadastrado(@Payload() data: LivroCadastradoEvent) {
    this.logger.log(
      `Evento livro.cadastrado recebido: id=${data.id_livro} titulo="${data.titulo}"`,
    );

    try {
      await this.notificationsService.processarNovoLivro(data);
    } catch (error) {
      this.logger.error(
        `Falha ao processar livro ${data.id_livro}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
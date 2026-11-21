import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MailService } from './mail.service';
import { NotificacoesRepository } from './notifications.repository';

@Module({
  providers: [NotificationsService, NotificacoesRepository, MailService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
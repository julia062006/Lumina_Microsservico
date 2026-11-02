import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MailService } from './mail.service';

@Module({
  providers: [NotificationsService, MailService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
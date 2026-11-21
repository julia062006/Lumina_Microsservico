import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { EventsService } from './events.service';

@Module({
  imports: [NotificationsModule],
  providers: [EventsService],
})
export class EventsModule {}
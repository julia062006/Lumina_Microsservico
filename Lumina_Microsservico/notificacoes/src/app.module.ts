import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [EventsModule, NotificationsModule],
})
export class AppModule {}

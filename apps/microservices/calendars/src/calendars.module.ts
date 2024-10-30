import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CalendarsController } from './calendars.controller';
import { CalendarsService } from './calendars.service';
import { UserDataMiddleware } from '@repo/nest-js';

@Module({
  imports: [],
  controllers: [CalendarsController],
  providers: [CalendarsService],
})
export class CalendarsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserDataMiddleware).forRoutes('*');
  }
}

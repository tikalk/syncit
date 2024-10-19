import { Module } from '@nestjs/common';
import { CalendarsController } from './calendars.controller';
import { CalendarsService } from './calendars.service';

@Module({
  imports: [],
  controllers: [CalendarsController],
  providers: [CalendarsService],
})
export class CalendarsModule {}

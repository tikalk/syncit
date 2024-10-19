import { Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { CalendarsService } from './calendars.service';

@Controller()
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  @Get('availableCalendars')
  async availableCalendars(@Req() request: Request, @Res() response: Response) {
    return this.calendarsService.availableCalendars(request, response);
  }

  @Post('availableCalendars')
  async addSelectedCalendar(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    return this.calendarsService.addCalendar(request, response);
  }

  @Delete('availableCalendars')
  async deleteSelectedCalendar(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    return this.calendarsService.deleteSelectedCalendar(request, response);
  }
}

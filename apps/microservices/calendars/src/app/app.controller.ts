import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
  Response,
  Request,
} from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { CalendarsService } from './app.service';

@Controller()
export class CalendarsController {
  constructor(
    private readonly calendarsService: CalendarsService,
    @Inject('EVENT_CHANGE') private rmqClient: ClientProxy
  ) {}

  @Get('availableCalendars')
  async availableCalendars(@Req() request: Request, @Res() response: Response) {
    return this.calendarsService.availableCalendars(request, response);
  }

  @Post('availableCalendars')
  async addSelectedCalendar(
    @Req() request: Request,
    @Res() response: Response
  ) {
    return this.calendarsService.addSelectedCalendar(request, response);
  }

  @Delete('availableCalendars')
  async deleteSelectedCalendar(
    @Req() request: Request,
    @Res() response: Response
  ) {
    return this.calendarsService.deleteSelectedCalendar(request, response);
  }

  @Post('callback/:calId')
  async sendQueue(
    @Req() request: Request,
    @Res() response: Response,
    @Ctx() context: RmqContext,
    @Param('calId') calId: number
  ) {
    console.warn('callback/:calId', calId);
    const events = await this.calendarsService.processGoogleNotification({
      calId,
      headers: request.headers,
      res: response,
    });
    let method = 'update';
    events.forEach((event) => {
      if (event.status === 'cancelled') {
        method = 'delete';
      } else if (
        event.created.slice(0, -5) === event.updated.slice(0, -5) ||
        event.id.search('_') > -1
      ) {
        method = 'create';
      }
      this.rmqClient.send(method, { calId, event }).subscribe();
      this.rmqClient.emit(method, { calId, event });
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return response.json({ status: 'ok' });
  }

  @EventPattern('update')
  async updateEvent(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('RMQ update-made');
    await this.calendarsService.updateEventOthersCals(data);
  }

  @EventPattern('delete')
  async deleteEvent(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('RMQ delete-made:');
    await this.calendarsService.deleteEventOthersCals(data);
  }

  @EventPattern('create')
  async createEvent(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('RMQ create-made');
    await this.calendarsService.addEventOtherCals(data);
  }
}

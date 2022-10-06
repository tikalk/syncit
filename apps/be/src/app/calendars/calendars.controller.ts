import { Response } from "express";
import { Controller, Delete, Get, Param, Post, Req, Res } from "@nestjs/common";
import { SqsService } from "@ssut/nestjs-sqs";
import { uuid } from "short-uuid";
import { CalendarsService } from "./calendars.service";
import { QUEUE_NAME } from "../app.module";

@Controller("calendars")
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService, private readonly sqsService: SqsService
  ) {
  }

  @Get("availableCalendars")
  async availableCalendars(@Req() request: Request, @Res() response: Response) {
    return this.calendarsService.availableCalendars(request, response);
  }

  @Post("availableCalendars")
  async addSelectedCalendar(@Req() request: Request, @Res() response: Response) {
    return this.calendarsService.addSelectedCalendar(request, response);
  }

  @Delete("availableCalendars")
  async deleteSelectedCalendar(@Req() request: Request, @Res() response: Response) {
    return this.calendarsService.deleteSelectedCalendar(request, response);
  }

  @Post("callback/:calId")
  async sendQueue(@Req() request: Request,
                  @Res() response: Response,
                  @Param("calId") calId: number
  ) {
    const events = await this.calendarsService.processGoogleNotification({
      calId,
      headers: request.headers,
      res: response
    });
    let method = "update";
    events.forEach(event => {
      if (event.status === "cancelled") {
        method = "delete";
      } else if (event.created.slice(0, -5) === event.updated.slice(0, -5) || event.id.search("_") > -1) {
        method = "create";
      }
      this.sqsService.send(QUEUE_NAME, {
        id: uuid(),
        groupId: method,
        deduplicationId: "deduplicationId",
        delaySeconds: 0,
        body: { method, calId, event }
      });
    });

    return response.json({ status: "ok" });
  }

//   @EventPattern("update")
//   async updateEvent(@Payload() data: any, @Ctx() context: RmqContext) {
//     await this.calendarsService.updateEventOthersCals(data)
//     console.log("RMQ update-made");
//   }
//
//   @EventPattern("delete")
//   async deleteEvent(@Payload() data: any, @Ctx() context: RmqContext) {
//     await this.calendarsService.deleteEventOthersCals(data)
//     console.log("RMQ delete-made:");
//   }
//
//   @EventPattern("create")
//   async createEvent(@Payload() data: any, @Ctx() context: RmqContext) {
//     await this.calendarsService.addEventOtherCals(data);
//     console.log("RMQ create-made");
//   }
}

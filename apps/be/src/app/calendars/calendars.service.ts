/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { google_calendar } from '@syncit2.0/integrations';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { GoogleCalendarService } = google_calendar;
@Injectable()
export class CalendarsService {
  async addSelectedCalendar(req, res) {
    const { userData } = res.locals;

    const prismaRes = await prisma.selectedCalendar.create({
      data: {
        userId: parseFloat(userData.id),
        integration: req.body.integration,
        externalId: req.body.externalId,
        credId: req.body.credId,
      },
    });
    const cred = await prisma.credential.findFirst({
      where: { id: req.body.credId },
    });

    const googleCalendarService = new GoogleCalendarService(cred);
    const gapiRes: any = await googleCalendarService.registerWatch({
      calId: prismaRes.id,
      externalId: req.body.externalId,
    });

    await prisma.selectedCalendar.update({
      where: { id: prismaRes.id },
      data: {
        watchId: gapiRes.data.id,
        watchExpiration: new Date(gapiRes.data.expiration * 1),
      },
    });

    res.send('ok');
  }

  async deleteSelectedCalendar(req, res) {
    const { userData } = res.locals;

    await prisma.selectedCalendar.deleteMany({
      where: {
        userId: parseFloat(userData.id),
        integration: req.body.integration,
        externalId: req.body.externalId,
      },
    });
    res.send('ok');
  }

  async availableCalendars(req, res) {
    const { userData } = req;
    const credentials = await prisma.credential.findMany({
      where: {
        userId: userData?.id,
      },
    });
    const output = [];
    const promises = [];
    credentials.forEach((cred) => {
      output.push({ id: cred.id, name: cred.account, type: cred.type });
      const googleCalendarService = new GoogleCalendarService(cred);
      promises.push(googleCalendarService.listCalendars());
    });
    const list = await Promise.all(promises);
    const selectedCalendars = await prisma.selectedCalendar.findMany({
      where: {
        userId: userData.id,
      },
    });
    const selectedCalendarsIds = selectedCalendars.map((cal) => cal.externalId);

    list.forEach((accountCalendars, ind) => {
      const mappedList = accountCalendars.map((cal) => ({
        ...cal,
        enabled: selectedCalendarsIds.includes(cal.externalId),
      }));

      output[ind].calendars = mappedList;
    });
    res.status(200).json({ list: output });
  }

  async processGoogleNotification({ calId, headers, res }) {
    const { userData } = res.locals;

    const exist = await prisma.selectedCalendar.findFirst({
      where: {
        id: parseFloat(calId),
      },
      include: {
        credential: true,
      },
    });
    if (!exist) {
      console.warn('stopping ', calId);
      const credentials = await prisma.credential.findMany({
        where: {
          userId: userData.id,
        },
      });

      const googleCalendarService = new GoogleCalendarService(credentials[0]);
      await googleCalendarService.stopWatch({
        channelId: headers['x-goog-channel-id'],
        resourceId: headers['x-goog-resource-id'],
      });
      return;
    }
    const googleCalendarService = new GoogleCalendarService(exist.credential);
    const { data }: any = await googleCalendarService.getEvent(
      exist.externalId
    );
    return data?.items;
  }

  async addEventOtherCals({ calId, event }) {
    if (event.summary === 'SyncIt Event') {
      console.warn('SyncIt event disabling');
      return;
    }
    const cal = await prisma.selectedCalendar.findFirst({
      where: {
        id: parseFloat(calId),
      },
    });
    const calendars = await prisma.selectedCalendar.findMany({
      where: {
        userId: cal.userId,
        NOT: {
          id: parseFloat(calId),
        },
      },
      include: {
        credential: true,
      },
    });
    const newEvent = {
      ...event,
      summary: `SyncIt Event`,
      description: event.id,
      attendees: null,
    };
    calendars.forEach((selectedCal) => {
      const googleCalendarService = new GoogleCalendarService(
        selectedCal.credential
      );
      googleCalendarService.createEvent(selectedCal.externalId, newEvent);
    });
  }

  async updateEventOthersCals({ calId, event }) {
    if (event.summary === 'SyncIt Event') {
      console.warn('SyncIt event disabling');
      return;
    }
    const cal = await prisma.selectedCalendar.findFirst({
      where: {
        id: parseFloat(calId),
      },
    });
    const calendars = await prisma.selectedCalendar.findMany({
      where: {
        userId: cal.userId,
        NOT: {
          id: parseFloat(calId),
        },
      },
      include: {
        credential: true,
      },
    });
    const newEvent = {
      ...event,
      summary: `SyncIt Event`,
      description: event.id,
      attendees: null,
    };
    calendars.forEach(async (selectedCal) => {
      const googleCalendarService = new GoogleCalendarService(
        selectedCal.credential
      );
      await googleCalendarService.updateEvent(
        selectedCal.externalId,
        event.id,
        newEvent
      );
    });
  }

  async deleteEventOthersCals({ calId, event }) {
    if (event.summary === 'SyncIt Event') {
      console.warn('SyncIt event disabling');
      return;
    }
    const cal = await prisma.selectedCalendar.findFirst({
      where: {
        id: parseFloat(calId),
      },
    });
    const calendars = await prisma.selectedCalendar.findMany({
      where: {
        userId: cal.userId,
        NOT: {
          id: parseFloat(calId),
        },
      },
      include: {
        credential: true,
      },
    });

    calendars.forEach(async (selectedCal) => {
      const googleCalendarService = new GoogleCalendarService(
        selectedCal.credential
      );
      await googleCalendarService.deleteEvent(selectedCal.externalId, event.id);
    });
  }
}

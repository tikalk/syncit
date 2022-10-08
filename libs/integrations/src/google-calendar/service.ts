/* eslint-disable no-async-promise-executor,max-lines */
import { Credential, PrismaClient } from '@prisma/client';
import { HttpError } from '@syncit2.0/core/utils';
import { Auth, google } from 'googleapis';
import { v4 } from 'uuid';
import {
  EventBusyDate,
  GoogleCalError,
  IntegrationCalendar,
  NewCalendarEventType,
} from '../../../../types/google_calendar';

const prisma = new PrismaClient();

export class GoogleCalendarService {
  private url = '';

  private integrationName = '';

  private auth: Promise<{ getToken: () => Promise<Auth.OAuth2Client> }>;

  private client_id = '';

  private client_secret = '';

  private redirect_uri = '';

  constructor(credential: Credential) {
    this.integrationName = 'google_calendar';
    this.auth = this.googleAuth(credential).then((m) => m);
  }

  private googleAuth = async ({ id, key }: Credential) => {
    const { client_id, client_secret, redirect_uris } = JSON.parse(
      process.env['GOOGLE_API_CREDENTIALS'] || ''
    ).web;
    if (typeof client_id === 'string') this.client_id = client_id;
    if (typeof client_secret === 'string') this.client_secret = client_secret;
    if (typeof redirect_uris === 'object' && Array.isArray(redirect_uris)) {
      this.redirect_uri = redirect_uris[0] as string;
    }
    if (!this.client_id)
      throw new HttpError({
        statusCode: 400,
        message: 'Google client_id missing.',
      });
    if (!this.client_secret)
      throw new HttpError({
        statusCode: 400,
        message: 'Google client_secret missing.',
      });
    if (!this.redirect_uri)
      throw new HttpError({
        statusCode: 400,
        message: 'Google redirect_uri missing.',
      });

    const myGoogleAuth = new Auth.OAuth2Client(
      this.client_id,
      this.client_secret,
      this.redirect_uri
    );

    const googleCredentials = key as Auth.Credentials;
    myGoogleAuth.setCredentials(googleCredentials);
    return { getToken: () => Promise.resolve(myGoogleAuth) };

    // const isExpired = () => googleCredentials.expiry_date < new Date().getTime();
    //
    // const refreshAccessToken = () =>
    //   myGoogleAuth
    //     .refreshToken(googleCredentials.refresh_token)
    //     .then(async (res: GetTokenResponse) => {
    //       const token = res.res?.data;
    //       googleCredentials.access_token = token.access_token;
    //       googleCredentials.expiry_date = token.expiry_date;
    //       await prisma.credential.update({
    //         where: {
    //           id
    //         },
    //         data: {
    //           key: googleCredentials as Prisma.InputJsonValue
    //         }
    //       });
    //       myGoogleAuth.setCredentials(googleCredentials);
    //       return myGoogleAuth;
    //     })
    //     .catch((err) => {
    //       console.error("Error refreshing google token", err);
    //       return myGoogleAuth;
    //     });
    //
    // return {
    //   getToken: () => (!isExpired() ? Promise.resolve(myGoogleAuth) : refreshAccessToken())
    // };
  };

  async listCalendars(): Promise<IntegrationCalendar[]> {
    return new Promise(async (resolve, reject) => {
      const auth = await this.auth;
      const myGoogleAuth = await auth.getToken();
      const calendar = google.calendar({
        version: 'v3',
        auth: myGoogleAuth,
      });

      calendar.calendarList
        .list()
        .then((cals) => {
          resolve(
            cals.data.items?.map((cal) => {
              const calendar: any = {
                externalId: cal.id ?? 'No id',
                integration: this.integrationName,
                name: cal.summary ?? 'No name',
                primary: cal.primary ?? false,
              };
              return calendar;
            }) || []
          );
        })
        .catch((err: Error) => {
          console.error(
            'There was an error contacting google calendar service: ',
            err
          );
          reject(err);
        });
    });
  }

  async getEvent(externalId: string) {
    const auth = await this.auth;
    const myGoogleAuth = await auth.getToken();
    const calendar = google.calendar({
      version: 'v3',
      auth: myGoogleAuth,
    });
    try {
      const gapiRes = await calendar.events.list({
        calendarId: externalId,
        updatedMin: new Date(new Date().getTime() - 10000).toISOString(),
        maxResults: 50,
        singleEvents: true,
        orderBy: 'startTime',
      });
      return gapiRes;
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  async createEvent(
    externalId: string,
    calEventRaw: any
  ): Promise<NewCalendarEventType> {
    return new Promise(async (resolve, reject) => {
      const auth = await this.auth;
      const myGoogleAuth = await auth.getToken();

      const calendar = google.calendar({
        version: 'v3',
      });
      calendar.events.insert(
        {
          auth: myGoogleAuth,
          calendarId: externalId,
          requestBody: calEventRaw,
          conferenceDataVersion: 1,
        },
        (err: any, event: any) => {
          if (err || !event?.data) {
            console.error(
              'There was an error contacting google calendar service: ',
              err
            );
            return reject(err);
          }

          return resolve({
            uid: '',
            ...event.data,
            id: event.data.id || '',
            additionalInfo: {
              hangoutLink: event.data.hangoutLink || '',
            },
            type: 'google_calendar',
            password: '',
            url: '',
          });
        }
      );
    });
  }

  async updateEvent(
    externalId: string,
    eventID: string,
    calEventRaw: any
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const auth = await this.auth;
      const myGoogleAuth = await auth.getToken();

      const calendar = google.calendar({
        version: 'v3',
        auth: myGoogleAuth,
      });
      calendar.events.update(
        {
          auth: myGoogleAuth,
          calendarId: externalId,
          eventId: eventID,
          sendNotifications: true,
          sendUpdates: 'all',
          requestBody: calEventRaw,
        },
        (err: any, event: any) => {
          if (err) {
            console.error(
              'There was an error contacting google calendar service: ',
              err
            );
            return reject(err);
          }
          return resolve(event?.data);
        }
      );
    });
  }

  async deleteEvent(externalId: string, eventID: string): Promise<void> {
    const auth = await this.auth;
    const myGoogleAuth = await auth.getToken();
    const calendar = google.calendar({
      version: 'v3',
      auth: myGoogleAuth,
    });

    calendar.events.delete(
      {
        auth: myGoogleAuth,
        calendarId: externalId,
        eventId: eventID,
        sendNotifications: false,
        sendUpdates: 'none',
      },
      (err: GoogleCalError | null, event) => {
        if (err) {
          /* 410 is when an event is already deleted on the Google cal before on cal.com
          404 is when the event is on a different calendar */
          if (err.code === 410 || err.code === 404) return true;
          console.error(
            'There was an error contacting google calendar service: ',
            err
          );
          return false;
        }
        return event?.data;
      }
    );
  }

  async registerWatch({
    calId,
    externalId,
  }: {
    calId: number;
    externalId: string;
  }) {
    const auth = await this.auth;
    const myGoogleAuth = await auth.getToken();
    const calendar = google.calendar({
      version: 'v3',
      auth: myGoogleAuth,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const res = await calendar.events.watch({
      calendarId: externalId,
      resource: {
        id: v4(),
        address: `${process.env['BE_PUBLIC_URL']}/api/calendars/callback/${calId}`,
        type: 'web_hook',
        params: {
          ttl: '30000',
        },
      },
    });
    return res;
  }

  async stopWatch({
    channelId,
    resourceId,
  }: {
    channelId: string;
    resourceId: string;
  }) {
    const auth = await this.auth;
    const myGoogleAuth = await auth.getToken();
    const calendar = google.calendar({
      version: 'v3',
      auth: myGoogleAuth,
    });
    const gapiRes = await calendar.channels.stop({
      requestBody: {
        id: channelId,
        resourceId,
      },
    });
  }

  async getAvailability(
    dateFrom: string,
    dateTo: string,
    selectedCalendars: IntegrationCalendar[]
  ): Promise<EventBusyDate[]> {
    return new Promise(async (resolve, reject) => {
      const auth = await this.auth;
      const myGoogleAuth = await auth.getToken();
      const calendar = google.calendar({
        version: 'v3',
        auth: myGoogleAuth,
      });
      const selectedCalendarIds = selectedCalendars
        .filter((e: any) => e.integration === this.integrationName)
        .map((e: any) => e.externalId);
      if (selectedCalendarIds.length === 0 && selectedCalendars.length > 0) {
        // Only calendars of other integrations selected
        resolve([]);
        return;
      }

      (selectedCalendarIds.length === 0
        ? calendar.calendarList
            .list()
            .then(
              (cals) =>
                cals.data.items?.map((cal) => cal.id).filter(Boolean) || []
            )
        : Promise.resolve(selectedCalendarIds)
      )
        .then((calsIds) => {
          calendar.freebusy.query(
            {
              requestBody: {
                timeMin: dateFrom,
                timeMax: dateTo,
                items: calsIds.map((id) => ({ id })),
              },
            },
            (err: any, apires: any) => {
              if (err) {
                reject(err);
              }
              let result: any = [];

              if (apires?.data.calendars) {
                result = Object.values(apires.data.calendars).reduce(
                  (c: any, i: any) => {
                    i.busy?.forEach((busyTime: any) => {
                      c.push({
                        start: busyTime.start || '',
                        end: busyTime.end || '',
                      });
                    });
                    return c;
                  },
                  [] as typeof result
                );
              }
              resolve(result);
            }
          );
        })
        .catch((err) => {
          console.error(
            'There was an error contacting google calendar service: ',
            err
          );
          reject(err);
        });
    });
  }
}

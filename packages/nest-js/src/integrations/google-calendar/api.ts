/* eslint-disable @typescript-eslint/ban-ts-comment */
import { google } from 'googleapis';
import { prisma } from '../../prisma';
import { configDotenv } from 'dotenv';
import { Request, Response } from 'express';
import { GoogleCalendarService } from './service';

configDotenv();

export type IntegrationOAuthCallbackState = {
  returnTo: string;
};

const scopes = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events",
];
const { client_id, client_secret } = JSON.parse(
  process.env["GOOGLE_API_CREDENTIALS"] || "",
).web;

export const add = async (req: Request, res: Response) => {
  if (req.method === "GET") {
    // Get token from Google Calendar API
    if (!client_id)
      return res.status(400).json({ message: "Google client_id missing." });
    if (!client_secret)
      return res.status(400).json({ message: "Google client_secret missing." });
    const { user: userData } = await prisma.session.findFirstOrThrow({
      where: { id: req.cookies["syncit-session-id"] },
      include: { user: true },
    });
    if (!userData?.id) {
      return res
        .status(401)
        .json({ message: "You must be logged in to do this" });
    }
    const redirect_uri = `${process.env["WEBAPP_URL"]}/api/integrations/google_calendar/callback`;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uri,
    );

    const state: IntegrationOAuthCallbackState =
      req.query["state"] !== "string"
        ? undefined
        : JSON.parse(req.query["state"] as string);

    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
      state: JSON.stringify(state),
    });

    return res.status(200).json({ url: authUrl });
  }
};

export const callback = async (req: Request, res: Response) => {
  const { code } = req.query;
  if (code && typeof code !== "string") {
    res.status(400).json({ message: "`code` must be a string" });
    return;
  }

  const { user: userData } = await prisma.session.findFirstOrThrow({
    where: { id: req.cookies["syncit-session-id"] },
    include: { user: true },
  });

  if (!userData?.id) {
    return res
      .status(401)
      .json({ message: "You must be logged in to do this" });
  }

  if (!client_id)
    return res.status(400).json({ message: "Google client_id missing." });
  if (!client_secret)
    return res.status(400).json({ message: "Google client_secret missing." });

  const redirect_uri = `${process.env["WEBAPP_URL"]}/api/integrations/google_calendar/callback`;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uri,
  );

  let key = "";

  if (code) {
    const token = await oAuth2Client.getToken(code as string);
    key = token.res?.data;
  }

  // @ts-ignore
  const googleService = new GoogleCalendarService({ key });
  const list = await googleService.listCalendars();
  // @ts-ignore
  const { externalId: primaryIsExpired } = list.find((cal) => cal.primary);

  await prisma.credential.upsert({
    // @ts-ignore
    where: {
      userId_account: { account: primaryIsExpired, userId: userData.id },
    },
    update: {
      type: 'google_calendar',
      account: primaryIsExpired,
      key,
      userId: userData.id,
    },
    create: {
      type: 'google_calendar',
      account: primaryIsExpired,
      key,
      userId: userData.id,
    },
  });
  const state: IntegrationOAuthCallbackState =
    typeof req.query["state"] !== "string"
      ? undefined
      : JSON.parse(req.query["state"] as string);

  res.redirect(state?.returnTo ?? "/");
};

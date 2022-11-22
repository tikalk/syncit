/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AuthGuard } from '@syncit2.0/core/nest-lib';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { createLogger } from '@syncit2.0/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createLogger('calendars'),
  });
  const globalPrefix = 'api/calendars';
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());
  app.useGlobalGuards(new AuthGuard());
  const port = process.env.PORT || 3335;
  await app.listen(port);
  Logger.log(
    `🚀 Calendars Microservice is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();

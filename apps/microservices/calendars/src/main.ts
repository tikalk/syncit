import { NestFactory } from '@nestjs/core';
import { CalendarsModule } from './calendars.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AuthGuard } from '@repo/nest-js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(CalendarsModule);
  const port = process.env.PORT ?? 3335;
  const globalPrefix = 'api/calendars';
  app.setGlobalPrefix(globalPrefix);

  app.use(cookieParser());
  app.useGlobalGuards(new AuthGuard());

  const config = new DocumentBuilder()
    .setTitle('Syncit Calendars service')
    .setDescription('The calendars service API for syncit')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  Logger.log(
    `🚀 Calendars Microservice is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();

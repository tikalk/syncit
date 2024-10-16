import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3335;
  const globalPrefix = 'api/calendars';
  app.setGlobalPrefix(globalPrefix);
  // app.use(cookieParser());
  // app.useGlobalGuards(new AuthGuard());
  await app.listen(port);
  Logger.log(
    `🚀 Calendars Microservice is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();

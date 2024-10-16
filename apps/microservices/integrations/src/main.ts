import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3336;
  const globalPrefix = 'api/integrations';
  app.setGlobalPrefix(globalPrefix);
  // app.use(cookieParser());
  await app.listen(port);
  Logger.log(
    `🚀 Integrations microservice is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();

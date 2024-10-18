import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { IntegrationsModule } from './integrations.module';
import * as cookieParser from 'cookie-parser';
import { AuthGuard } from '@repo/nest-js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(IntegrationsModule);
  const port = process.env.PORT || 3336;
  const globalPrefix = 'api/integrations';
  app.setGlobalPrefix(globalPrefix);

  app.use(cookieParser());
  app.useGlobalGuards(new AuthGuard());

  const config = new DocumentBuilder()
    .setTitle('Syncit Integrations service')
    .setDescription('The integrations service API for syncit')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  Logger.log(
    `🚀 Integrations microservice is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();

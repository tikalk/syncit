import { AuthModule } from './auth.module';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AuthGuard } from './auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const port = process.env.PORT || 3334;
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.use(cookieParser());
  app.useGlobalGuards(new AuthGuard());

  const config = new DocumentBuilder()
    .setTitle('Syncit Auth service')
    .setDescription('The auth service API for syncit')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  Logger.log(
    `🚀 Auth microservice is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();

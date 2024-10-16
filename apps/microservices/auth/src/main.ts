import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3334;
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // app.use(cookieParser());
  // app.useGlobalGuards(new AuthGuard());

  // const config = new DocumentBuilder()
  //   .setTitle('Auth service')
  //   .setDescription('The auth service API description')
  //   .setVersion('1.0')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);

  await app.listen(port);
  Logger.log(
    `🚀 Auth microservice is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();

import { Logger } from '@nestjs/common';
 import { NestFactory } from '@nestjs/core';
 import * as cookieParser from 'cookie-parser';
 
 import { AppModule } from './app/app.module';
 
 async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   app.use(cookieParser());
   const globalPrefix = 'api/integrations';
   app.setGlobalPrefix(globalPrefix);
   const port = process.env.PORT || 3336;
   await app.listen(port);
   Logger.log(
     `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
   );
 }
 
 bootstrap();
 
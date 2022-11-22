import { Module } from '@nestjs/common';
import { IntegrationsController } from './app.controller';

@Module({
  imports: [],
  controllers: [IntegrationsController],
})
export class AppModule {}

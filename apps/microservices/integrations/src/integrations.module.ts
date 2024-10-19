import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';

@Module({
  imports: [],
  controllers: [IntegrationsController],
  providers: [],
})
export class IntegrationsModule {}

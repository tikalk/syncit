import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { UserDataMiddleware } from '@repo/nest-js';

@Module({
  imports: [],
  controllers: [IntegrationsController],
  providers: [],
})
export class IntegrationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserDataMiddleware).forRoutes('*');
  }
}

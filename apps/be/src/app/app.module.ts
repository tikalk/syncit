import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { IntegrationsController } from './integrations/integrations.controller';
import { UserDataMiddleware } from '@syncit2.0/core/nest-lib';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENT_CHANGE',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RABBITMQ_HOST}`],
          queue: 'event_change',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [ IntegrationsController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserDataMiddleware).forRoutes('*');
  }
}

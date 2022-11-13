import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserDataMiddleware } from '@syncit2.0/core/nest-lib';
import { CalendarsController } from './app.controller';
import { CalendarsService } from './app.service';

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
  controllers: [CalendarsController],
  providers: [CalendarsService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserDataMiddleware).forRoutes('*');
  }
}
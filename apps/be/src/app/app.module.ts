import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { SqsModule } from "@ssut/nestjs-sqs";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { CalendarsController } from "./calendars/calendars.controller";
import { CalendarsService } from "./calendars/calendars.service";
import { IntegrationsController } from "./integrations/integrations.controller";
import { UserDataMiddleware } from "./user.data.middleware";

export const QUEUE_NAME = process.env.NODE_ENV === "production" ? "syncit-prod" : "syncit-staging";

@Module({
  imports: [
    SqsModule.register({
      consumers: [],
      producers: [{
        name: QUEUE_NAME,
        queueUrl: "https://sqs.us-east-1.amazonaws.com/074357595072/syncit-staging"
      }]
    })
  ],
  controllers: [AuthController, CalendarsController, IntegrationsController],
  providers: [AuthService, CalendarsService]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserDataMiddleware).forRoutes("*");
  }
}

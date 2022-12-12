import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { createMock } from '@golevelup/ts-jest';
import { mockReset } from 'jest-mock-extended';
import { CalendarsController } from './app.controller';
import { CalendarsService } from './app.service';

describe('CalendarsController', () => {
  let app: TestingModule;

  const mockResponseObject = () => {
    return createMock<Response>({
      end: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      status: jest.fn().mockReturnThis(),
    });
  };
  let response = mockResponseObject();

  beforeAll(async () => {
    app = await Test.createTestingModule({
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
    }).compile();
  });

  beforeEach(() => {
    mockReset(response);
    response = mockResponseObject();
  });

  beforeEach(() => {
    mockReset(response);
    response = mockResponseObject();
  });

  describe('availableCalendars', () => {
    it('should return "list" of calender meetings', async () => {
      const calendarsController =
        app.get<CalendarsController>(CalendarsController);

      const request = createMock<Request>();
      await calendarsController.availableCalendars(request, response);

      expect(response.json).toHaveBeenCalledTimes(1);
      // expect(response.json).toHaveBeenCalledWith({ list: [] });
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });
});

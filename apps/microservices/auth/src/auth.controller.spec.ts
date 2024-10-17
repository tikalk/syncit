import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AppController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      const req: Request = { cookies: {} } as unknown as Request;
      const statusResponseMock = {
        send: jest.fn((x) => x),
      };

      const res = {
        status: jest.fn(() => statusResponseMock),
        send: jest.fn((x) => x),
      } as unknown as Response;
      expect(await authController.me(req, res)).toBe(undefined);
    });
  });
});

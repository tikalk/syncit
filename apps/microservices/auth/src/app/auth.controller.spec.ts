/* eslint-disable @typescript-eslint/ban-ts-comment, @nrwl/nx/enforce-module-boundaries, max-lines */
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from '@nestjs/common';
import { prismaMock } from '../../../../../libs/models/src/testing/prismaMock';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { createMock } from '@golevelup/ts-jest';
import { mockReset } from 'jest-mock-extended';
import { hashPassword } from '@syncit2.0/core/utils';

describe('AuthController', () => {
  let app: TestingModule;
  let mockRequest = createMock<Request>();

  const mockResponseObject = () => {
    return createMock<Response>({
      end: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      // @ts-ignore
      status: jest.fn().mockReturnThis(),
    });
  };
  let response = mockResponseObject();

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();
  });

  beforeEach(() => {
    mockReset(response);
    response = mockResponseObject();
  });

  describe('Test `api/auth/register` end point', () => {
    it('should return status 422 and invalid `email` message', async () => {
      const authController = app.get<AuthController>(AuthController);
      mockRequest = createMock<Request>();
      await authController.register(mockRequest, response);

      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith({ message: 'Invalid email' });
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(422);
    });

    it('should return status 422 and invalid `name` message', async () => {
      const authController = app.get<AuthController>(AuthController);
      const request = createMock<Request>({
        // @ts-ignore
        body: { email: 'aaa@bbb.ccc' },
      });

      await authController.register(request, response);

      expect(response.json).toHaveBeenLastCalledWith({
        message: 'Invalid name',
      });
      expect(response.status).toHaveBeenLastCalledWith(422);
    });

    it('should return status 422 and invalid `password` message', async () => {
      const authController = app.get<AuthController>(AuthController);
      const request = createMock<Request>({
        // @ts-ignore
        body: { email: 'aaa@bbb.ccc', name: 'john doe' },
      });

      await authController.register(request, response);

      expect(response.json).toHaveBeenLastCalledWith({
        message:
          'Invalid input - password should be at least 7 characters long.',
      });
      expect(response.status).toHaveBeenLastCalledWith(422);
    });

    it('should return status 409 and email address already exist', async () => {
      const authController = app.get<AuthController>(AuthController);
      const user = {
        email: 'aaa@bbb.ccc',
        name: 'john doe',
        password: '12345678',
      };
      const request = createMock<Request>({
        // @ts-ignore
        body: user,
      });

      // @ts-ignore
      prismaMock.user.findFirst.mockResolvedValue(user);

      await authController.register(request, response);

      expect(response.json).toHaveBeenLastCalledWith({
        message: 'Email address is already registered',
      });
      expect(response.status).toHaveBeenLastCalledWith(409);
    });

    it('should return status 200', async () => {
      const authController = app.get<AuthController>(AuthController);
      const user = {
        email: 'aaa@bbb.ccc',
        name: 'john doe',
        password: '12345678',
      };
      const request = createMock<Request>({
        // @ts-ignore
        body: user,
      });

      // @ts-ignore
      prismaMock.user.findFirst.mockResolvedValue(false);
      // @ts-ignore
      prismaMock.user.upsert.mockResolvedValue(user);

      await authController.register(request, response);

      expect(response.status).toHaveBeenLastCalledWith(201);
    });
  });

  describe('Test `api/auth/login` end point', () => {
    it('should return status 422 and invalid `email` message', async () => {
      const authController = app.get<AuthController>(AuthController);
      mockRequest = createMock<Request>();
      await authController.login(mockRequest, response);

      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith({ message: 'Invalid email' });
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(422);
    });

    it('should return status 422 and invalid `password` message', async () => {
      const authController = app.get<AuthController>(AuthController);
      const request = createMock<Request>({
        // @ts-ignore
        body: { email: 'aaa@bbb.ccc' },
      });

      await authController.login(request, response);

      expect(response.json).toHaveBeenLastCalledWith({
        message:
          'Invalid input - password should be at least 7 characters long.',
      });
      expect(response.status).toHaveBeenLastCalledWith(422);
    });

    it('should return status 401 Unauthorized', async () => {
      const authController = app.get<AuthController>(AuthController);
      const user = {
        email: 'aaa@bbb.ccc',
        password: '12345678',
      };
      const request = createMock<Request>({
        // @ts-ignore
        body: user,
      });

      // @ts-ignore
      prismaMock.user.findFirst.mockResolvedValue(user);

      await authController.login(request, response);

      expect(response.json).toHaveBeenLastCalledWith({
        message: 'Unauthorized',
      });
      expect(response.status).toHaveBeenLastCalledWith(401);
    });

    it('should return status 200', async () => {
      const authController = app.get<AuthController>(AuthController);
      const user = {
        email: 'aaa@bbb.ccc',
        password: '12345678',
      };
      const request = createMock<Request>({
        // @ts-ignore
        body: user,
      });

      const hashedPassword = await hashPassword('12345678');

      // @ts-ignore
      prismaMock.user.findFirst.mockResolvedValue({
        ...user,
        password: hashedPassword,
      });

      await authController.login(request, response);

      expect(response.status).toHaveBeenLastCalledWith(200);
    });
  });
  describe('Test `api/auth/logout` end point', () => {
    it('should return status 200', async () => {
      const authController = app.get<AuthController>(AuthController);
      const request = createMock<Request>();
      await authController.logout(request, response);

      expect(response.status).toHaveBeenLastCalledWith(200);
    });
  });

  describe('Test `api/auth/me` end point', () => {
    it('should return status 401', async () => {
      const authController = app.get<AuthController>(AuthController);
      const request = createMock<Request>();
      await authController.me(request, response);

      expect(response.status).toHaveBeenLastCalledWith(401);
    });
    it('should return status 200', async () => {
      const authController = app.get<AuthController>(AuthController);
      const request = createMock<Request>();
      // @ts-ignore
      response.locals.userData = { id: 1, name: 'avishay' };
      await authController.me(request, response);

      expect(response.status).toHaveBeenLastCalledWith(200);
    });
  });
});

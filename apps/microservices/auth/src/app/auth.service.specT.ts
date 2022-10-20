// import { Test } from '@nestjs/testing';
//
// import { AuthService } from './auth.service';
// import { createMock } from '@golevelup/ts-jest';
//
// describe('AuthService', () => {
//   let service: AuthService;
//
//   beforeAll(async () => {
//     const app = await Test.createTestingModule({
//       providers: [AuthService],
//     }).compile();
//
//     service = app.get<AuthService>(AuthService);
//   });
//
//   describe('getData', () => {
//     it('should return "Welcome to auth!"', async () => {
//       const mockRequest = createMock<Request>({ method: 'GET' });
//       const mockResponseObject = () => {
//         return createMock<Response>({
//           json: jest.fn().mockReturnThis(),
//           // @ts-ignore
//           status: jest.fn().mockReturnThis(),
//         });
//       };
//       const response = mockResponseObject();
//
//       await service.me(mockRequest, mockResponseObject);
//       expect(response.json).toHaveBeenCalledTimes(1);
//       expect(response.json).toHaveBeenCalledWith({ cars: [] });
//       expect(response.status).toHaveBeenCalledTimes(1);
//       expect(response.status).toHaveBeenCalledWith(200);
//     });
//   });
// });

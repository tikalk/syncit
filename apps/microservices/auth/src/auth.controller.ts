import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { LoginInput, RegisterInput, UserData } from './auth.models';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({
    description: 'Registration params',
    type: RegisterInput,
  })
  @ApiCreatedResponse({
    description: 'User registered successfully and cookie saved on initiator.',
    type: RegisterInput,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Error with the data sent.',
  })
  @ApiConflictResponse({
    description: 'User (email) already exist.',
  })
  async register(@Req() request: Request, @Res() response: Response) {
    return this.authService.register(request, response);
  }

  @Post('login')
  @ApiBody({
    description: 'Login params',
    type: LoginInput,
  })
  @ApiOkResponse({
    description: 'User logged in successfully and cookie saved on initiator.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Error with the data sent.',
  })
  @ApiUnauthorizedResponse({
    description: 'Error with the data sent. Unauthorized',
  })
  async login(@Req() request: Request, @Res() response: Response) {
    return this.authService.login(request, response);
  }

  @Post('logout')
  @ApiOkResponse({
    description:
      'User successfully logged out and cookie removed from initiator.',
  })
  async logout(@Req() request: Request, @Res() response: Response) {
    return this.authService.logout(request, response);
  }

  @Get('me')
  @ApiOkResponse({
    description: 'Returns user data if logged in',
    type: UserData,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description: 'Unauthorized - Blocked by auth guard',
  })
  async me(@Req() request: Request, @Res() response: Response) {
    return this.authService.me(request, response);
  }
}

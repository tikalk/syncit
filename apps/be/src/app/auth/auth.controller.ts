import { Controller, Get, Post, Req, Res } from "@nestjs/common";

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Req() request: Request, @Res() response : Response) {
    return this.authService.register(request,response)
  }

  @Post('login')
  async login(@Req() request: Request, @Res() response : Response) {
    return this.authService.login(request,response)
  }

  @Get('me')
  async me(@Req() request: Request, @Res() response : Response) {
    return this.authService.me(request,response)
  }
}

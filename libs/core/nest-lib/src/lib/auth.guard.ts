import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getUserDataFromSessionId } from '@syncit2.0/core/utils';

const unProtectedRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/calendars/callback/:calId',
];

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (unProtectedRoutes.includes(request.route.path)) {
      return true;
    }
    const userData = await getUserDataFromSessionId(request.cookies.sessionID);
    return userData?.id;
  }
}

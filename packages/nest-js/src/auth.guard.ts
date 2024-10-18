import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { prisma } from './prisma';

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

    const { user } = await prisma.session.findFirst({
      where: { id: request.cookies['syncit-session-id'] },
      include: { user: true },
    });
    return !!user?.id;
  }
}

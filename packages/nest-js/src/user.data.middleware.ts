import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { prisma } from './prisma';

@Injectable()
export class UserDataMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = await prisma.session.findFirstOrThrow({
        where: { id: req.cookies['syncit-session-id'] },
        include: { user: true },
      });
      res.locals.userData = user;
    } catch (e) {
      console.error('failed to get user data', e);
    }
    next();
  }
}

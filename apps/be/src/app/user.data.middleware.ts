import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { getUserDataFromSessionId } from '@syncit2.0/core/utils';
// other imports

@Injectable()
export class UserDataMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const userData = await getUserDataFromSessionId(req.cookies.sessionID);
    res.locals.userData = userData;
    next();
  }
}

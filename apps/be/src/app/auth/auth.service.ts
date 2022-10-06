import { Injectable } from '@nestjs/common';
import {
  getSessionIdFromUserData,
  hashPassword,
  setCookie,
  verifyPassword,
} from '@syncit2.0/core/utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  async login(req, res) {
    const { email, password } = req.body;
    const userEmail = email?.toLowerCase();

    if (!userEmail || !userEmail.includes('@')) {
      res.status(422).json({ message: 'Invalid email' });
      return;
    }

    if (!password || password.trim().length < 7) {
      res
        .status(422)
        .json({
          message:
            'Invalid input - password should be at least 7 characters long.',
        });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
    });
    if (existingUser) {
      const verified = await verifyPassword(password, existingUser.password);
      if (verified) {
        delete existingUser.password;
        const sessionID = await getSessionIdFromUserData(existingUser);
        setCookie(res, 'sessionID', sessionID, {
          maxAge: 1000 * 60 * 60,
          path: '/',
          httpOnly: true,
        });
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.end(res.getHeader('Set-Cookie'));
        return;
      }
    }
    res.status(401).json({ message: 'Unauthorized' });
  }

  async register(req, res) {
    const { name, email, password } = req.body;
    const userEmail = email?.toLowerCase();

    if (!name) {
      res.status(422).json({ message: 'Invalid name' });
      return;
    }

    if (!userEmail || !userEmail.includes('@')) {
      res.status(422).json({ message: 'Invalid email' });
      return;
    }

    if (!password || password.trim().length < 7) {
      res
        .status(422)
        .json({
          message:
            'Invalid input - password should be at least 7 characters long.',
        });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
    });

    if (existingUser) {
      const message = 'Email address is already registered';

      res.status(409).json({ message });
      return;
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.upsert({
      where: { email: userEmail },
      update: {
        name,
        email: userEmail,
        password: hashedPassword,
        created: new Date(Date.now()),
      },
      create: {
        name,
        email: userEmail,
        password: hashedPassword,
        created: new Date(Date.now()),
      },
    });
    const newUser = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
    });
    delete newUser.password;
    const sessionID = await getSessionIdFromUserData(existingUser);
    setCookie(res, 'sessionID', sessionID, {
      maxAge: 1000 * 60 * 60,
      path: '/',
      httpOnly: true,
    });
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.end(res.getHeader('Set-Cookie'));
  }

  async me(req, res) {
    const { userData } = res.locals;
    if (userData?.id) {
      res.json({ userData });
      return;
    }
    res.status(401).send('unauthorized');
  }
}

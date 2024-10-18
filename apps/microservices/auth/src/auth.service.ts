import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { hashPassword, verifyPassword } from './utils/auth';
import { v6 } from 'uuid';
import dayjs from 'dayjs';
import { prisma } from './prisma';

const LoginInputSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .transform((email) => email.trim().toLowerCase()),
  password: z.string().min(8, 'Password must contain at least 8 characters'),
});

const RegisterInputSchema = z.object({
  name: z.string().transform((name) => name.trim()),
  email: z
    .string()
    .email('Invalid email format')
    .transform((email) => email.trim().toLowerCase()),
  password: z.string().min(8, 'Password must contain at least 8 characters'),
});

@Injectable()
export class AuthService {
  async logout(req, res) {
    if (req.cookies['syncit-session-id']) {
      await prisma.session.deleteMany({
        where: { id: req.cookies.sessionID },
      });
    }
    res.cookie('syncit-session-id', 0, {
      maxAge: -1,
      path: '/',
      httpOnly: true,
    });
    res.status(200).end(res.getHeader('Set-Cookie'));
  }

  async login(req, res) {
    const body = LoginInputSchema.safeParse(req.body);
    if (!body.success) {
      res.status(422).json({ message: body.error });
      return;
    }
    const { email, password } = body.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      const verified = await verifyPassword(password, existingUser.password);
      if (verified) {
        const sessionID = v6();
        await prisma.session.deleteMany({ where: { userId: existingUser.id } });
        await prisma.session.create({
          data: {
            id: sessionID,
            userId: existingUser.id,
            expDate: dayjs(dayjs().unix() + 1000 * 60 * 60).toISOString(),
          },
        });
        res.cookie('syncit-session-id', sessionID, {
          maxAge: 1000 * 60 * 60,
          path: '/',
          httpOnly: true,
        });
        res.status(200).send(existingUser);
        return;
      }
    }
    res.status(401).json({ message: 'Unauthorized' });
  }

  async register(req, res) {
    const body = RegisterInputSchema.safeParse(req.body);

    if (!body.success) {
      res.status(422).json({ message: body.error });
      return;
    }
    const { name, email, password } = body.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      const message = 'Email address is already registered';

      res.status(409).json({ message });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email,
        password: hashedPassword,
        created: new Date(Date.now()),
      },
    });

    const sessionID = v6();
    await prisma.session.deleteMany({ where: { userId: newUser.id } });
    await prisma.session.create({
      data: {
        id: sessionID,
        userId: newUser.id,
        expDate: dayjs(dayjs().unix() + 1000 * 60 * 60).toISOString(),
      },
    });
    res.cookie('syncit-session-id', sessionID, {
      maxAge: 1000 * 60 * 60,
      path: '/',
      httpOnly: true,
    });
    res.status(201).send(newUser);
    return;
  }

  async me(req, res) {
    if (req.cookies['syncit-session-id']) {
      const { user } = await prisma.session.findFirst({
        where: { id: req.cookies.sessionID },
        include: { user: true },
      });
      if (user?.id) {
        res.status(200).json({ user });
        return;
      }
    }
    res.status(401).send('unauthorized');
  }
}

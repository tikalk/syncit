import type { RequestEvent, RequestEventCommon } from '@builder.io/qwik-city';
import { globalAction$, routeLoader$, z, zod$ } from '@builder.io/qwik-city';
import type { User } from '@repo/db';
import { parseString, splitCookiesString } from 'set-cookie-parser';

const fixCookies = (req: RequestEventCommon) => {
  req.headers.set('set-cookie', req.headers.get('set-cookie') || '');
  const cookie = req.headers.get('set-cookie');
  if (cookie) {
    req.headers.delete('set-cookie');
    splitCookiesString(cookie).forEach((cookie) => {
      const { name, value, ...rest } = parseString(cookie);
      req.cookie.set(name, value, rest as any);
    });
  }
};

function AuthQrl() {
  const useSignIn = globalAction$(async (data, req) => {
      const redirectTo = data.redirectTo ?? '/';

      const res = await fetch(
        `${import.meta.env.PUBLIC_SERVER_URL}/api/auth/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        },
      );
      if (res.ok) {
        const cookie = res.headers.get('set-cookie');
        if (cookie) {
          req.headers.set('set-cookie', cookie);
          fixCookies(req);
        }
        const data = await res.json();
        req.sharedMap.set('session', data);
      }

      if (redirectTo) {
        throw req.redirect(302, redirectTo);
      }
    },
    zod$({
      redirectTo: z.string().optional(),
      email: z.string().email(),
      password: z.string().min(7, 'Password is required'),
    }));

  const useSignUp = globalAction$(async (data, req) => {
      const redirectTo = data.redirectTo ?? '/';

      const res = await fetch(
        `${import.meta.env.PUBLIC_SERVER_URL}/api/auth/register`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            name: data.name,
            password: data.password,
          }),
        },
      );
      if (res.ok) {
        const cookie = res.headers.get('set-cookie');
        if (cookie) {
          req.headers.set('set-cookie', cookie);
          fixCookies(req);
        }
        const data = await res.json();
        req.sharedMap.set('session', data);
      }

      if (redirectTo) {
        throw req.redirect(302, redirectTo);
      }
    },
    zod$({
      redirectTo: z.string().optional(),
      email: z.string().email().transform((name) => name.trim().toLowerCase()),
      password: z.string().min(7, 'Password is required'),
      name: z.string().transform((name) => name.trim()),
    }));

  const useUpdate = globalAction$(async (data, req) => {
      const redirectTo = data.redirectTo ?? '/';

      const res = await fetch(
        `${import.meta.env.PUBLIC_SERVER_URL}/api/auth/register`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            name: data.name,
            password: data.password,
          }),
        },
      );
      if (res.ok) {
        const cookie = res.headers.get('set-cookie');
        if (cookie) {
          req.headers.set('set-cookie', cookie);
          fixCookies(req);
        }
        const data = await res.json();
        req.sharedMap.set('session', data);
      }

      if (redirectTo) {
        throw req.redirect(302, redirectTo);
      }
    },
    zod$({
      redirectTo: z.string().optional(),
      email: z.string().email().transform((name) => name.trim().toLowerCase()),
      password: z.string().min(7, 'Password is required'),
      name: z.string().transform((name) => name.trim()),
    }));

  const useSignOut = globalAction$(
    async ({ redirectTo }, req) => {
      redirectTo ??= '/auth/login';

      const res = await fetch(
        `${import.meta.env.PUBLIC_SERVER_URL}/api/auth/logout`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (res.ok) {
        const cookie = res.headers.get('set-cookie');
        if (cookie) {
          req.headers.set('set-cookie', cookie);
          fixCookies(req);
          try {
            req.cookie.delete('syncit-session-id');
          } catch (e) {
            console.warn(e);
          }
        }
        req.sharedMap.delete('session');
      }
      throw req.redirect(302, redirectTo);
    },
    zod$({
      redirectTo: z.string().optional(),
    }),
  );

  const useSession = routeLoader$((req) => {
    return req.sharedMap.get('session') as User | null;
  });

  const onRequest = async (req: RequestEvent) => {
    const res = await fetch(
      `${import.meta.env.PUBLIC_SERVER_URL}/api/auth/me`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cookie': `syncit-session-id=${req.cookie.get('syncit-session-id')?.value}`,
        },
      },
    );
    if (res.ok) {
      const data = await res.json();
      req.sharedMap.set('session', data?.user);
    }
  };

  return { useSignIn, useSignOut, useSession, useSignUp, onRequest, useUpdate };
}


export const { onRequest, useSession, useSignIn, useSignOut, useSignUp, useUpdate } = AuthQrl();
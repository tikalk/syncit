import { compare, hash } from 'bcryptjs';
import { NextApiResponse } from 'next';
import { serialize, CookieSerializeOptions } from 'cookie';

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}
export const b64Decode = (str: string): string =>
  Buffer.from(str, 'base64').toString('binary');
export const b64Encode = (str: string): string =>
  Buffer.from(str, 'binary').toString('base64');

export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue =
    typeof value === 'object'
      ? b64Encode(JSON.stringify(value))
      : String(value);

  if ('maxAge' in options && options.maxAge) {
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
  }

  res.setHeader('Set-Cookie', serialize(name, stringValue, options));
};

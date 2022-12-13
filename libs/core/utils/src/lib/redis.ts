import Redis from 'ioredis';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { b64Decode, b64Encode } from './auth';

const redisPort = parseFloat(process.env['REDIS_PORT'] || '6379');
const redisHost = process.env['REDIS_HOST'] || 'redis';

export const redis = new Redis(redisPort, redisHost);

export const getSessionIdFromUserData = async (userData: User) => {
  const sessionID = uuidv4();
  await redis.set(
    sessionID,
    b64Encode(JSON.stringify(userData)),
    'EX',
    60 * 60 * 24
  );
  return sessionID as string;
};

export const getUserDataFromSessionId = async (sessionId: string) => {
  const token = await redis.get(sessionId);
  if (!token) {
    return false;
  }
  return JSON.parse(b64Decode(token));
};

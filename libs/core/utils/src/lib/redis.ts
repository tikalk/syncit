import Redis from 'ioredis';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { b64Decode, b64Encode } from './auth';

export const redis = new Redis({
  port: 6379, // Redis port
  host: "redis", // Redis host
});

export const getSessionIdFromUserData = async (userData: User) => {
  const sessionID = uuidv4();
  console.log(redis);
  await redis.set(
    sessionID,
    b64Encode(JSON.stringify(userData)),
    'EX',
    60 * 60 * 24
  );
  return sessionID as string;
};

export const getUserDataFromSessionId = async (sessionId: string) => {
  console.log(redis);
  const token = await redis.get(sessionId);
  if (!token) {
    return false;
  }
  return JSON.parse(b64Decode(token));
};

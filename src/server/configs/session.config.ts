import { redisStore } from '@srvr/database/redis.database';
import { envSessionCookieSecret } from './env.config';

const sessionConfig = {
    sessionCookieSecret: envSessionCookieSecret,
    sessionCookieName: "gns3lab",
    sessionStore: redisStore,
    sessionCookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 3, // 3 hours
    },
    sessionSaveUninitialized: true,
    sessionResave: true,
};
  
export default sessionConfig;
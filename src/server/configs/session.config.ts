import { redisStore } from '@srvr/database/redis.database.js';
import { envSessionCookieSecret } from './env.config.js';

const sessionConfig = {
    sessionCookieSecret: envSessionCookieSecret,
    sessionCookieName: "gns3netlab.sess",
    sessionStore: redisStore,
    sessionCookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 3, // 3 hours
    },
    sessionSaveUninitialized: false,
    sessionResave: false,
};
  
export default sessionConfig;
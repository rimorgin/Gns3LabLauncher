const { redisStore } = require('../database/redis.database');
const { envSessionCookieSecret } = require('./env.config');

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
  
module.exports = sessionConfig;
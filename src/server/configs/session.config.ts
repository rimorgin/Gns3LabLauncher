import { redisStore } from "@srvr/database/redis.database.ts";
import { envSessionCookieSecret, MODE } from "./env.config.ts";

const sessionConfig = {
  sessionCookieSecret: envSessionCookieSecret,
  sessionCookieName: "gns3lab",
  sessionStore: redisStore,
  sessionCookieOptions: {
    secure: MODE === "production" || MODE === "staging",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 3, // 3 hours
    //1000 * 60 * 2,
  },
  sessionSaveUninitialized: true,
  sessionResave: true,
};

export default sessionConfig;

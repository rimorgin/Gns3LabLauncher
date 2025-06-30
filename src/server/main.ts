import ViteExpress from "vite-express";
import express from "express";
import http from "http";
import https from "https";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import passport from "passport";

import Redis from "@srvr/database/redis.database.ts";
import Postgres from "@srvr/database/postgres.database.ts";

import registerFeatures from "@srvr/features/index.features.ts";

import helmetMiddleware from "@srvr/middlewares/helmet.middleware.ts";
import loggerMiddleware from "@srvr/middlewares/logger.middleware.ts";
import sessionMiddleware from "@srvr/middlewares/session.middleware.ts";
import csrfTokenMiddleware from "@srvr/middlewares/csrf.middleware.ts";

import rateLimiterMiddleware from "@srvr/middlewares/rate-limiter.middleware.ts";
import vpnOnlyMiddleware from "@srvr/middlewares/vpn.middleware.ts";
import errorMiddleware from "@srvr/middlewares/error.middleware.ts";

import { csrfSynchronisedProtection } from "@srvr/configs/csrf.config.ts";
import { envServerPort, MODE } from "@srvr/configs/env.config.ts";
import webSocketListener from "./features/websocket/websocket.handler.ts";

const app = express();
let server;

// Initialize Data Storage
await Redis();
await Postgres();

// Middleware stack
//app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// SECURITY
app.use(helmetMiddleware());
app.use(csrfTokenMiddleware);
app.use(csrfSynchronisedProtection);
// Reduce fingerprinting
app.disable("x-powered-by");
// prevent DDos or Brute Force
app.use(rateLimiterMiddleware); //disable in development
// enforce single session only
//app.use(enforceSingleSessionOnly)
// enforce validation of session every client mounts

// LOGGING
app.use(loggerMiddleware);
// ERROR HANDLING
app.use(errorMiddleware);

// Routes
await registerFeatures(app);

if (MODE === "production" || MODE === "staging") {
  const key = fs.readFileSync(
    path.resolve("./cert/vite-express.key.pem"),
    "utf8",
  );
  const cert = fs.readFileSync(
    path.resolve("./cert/vite-express.cert.pem"),
    "utf8",
  );
  server = https.createServer({ key, cert }, app);
  console.log("🌐 HTTPS server configured");

  const { default: vpnConnect } = await import("@srvr/configs/vpn.config.js");
  // enable vpn when not in development
  console.log("🔗 Connecting to VPN...");
  await vpnConnect();
  app.use(vpnOnlyMiddleware);

  /*   ViteExpress.config({
    //@ts-expect-error type staging no allowed
    mode: MODE,
    inlineViteConfig({})
  }) */
} else {
  server = http.createServer(app);
  console.log("🌐 HTTP server running (non-production)");
}

export const io = new SocketIOServer(server);

server.listen(envServerPort, () => {
  console.log(`🚀 Server is listening on port ${envServerPort}`);
});

// initialize websocket connection handlers
webSocketListener();

//@ts-expect-error staging mode is not allowed
ViteExpress.config({ mode: MODE });
ViteExpress.bind(app, server);

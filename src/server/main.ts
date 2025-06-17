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

import registerFeatures, { registerWsFeature } from "@srvr/features/index.features.ts";

import corsMiddleware from "@srvr/middlewares/cors.middleware.ts";
import loggerMiddleware from "@srvr/middlewares/logger.middleware.ts";
import sessionMiddleware from "@srvr/middlewares/session.middleware.ts";
import csrfTokenMiddleware from "@srvr/middlewares/csrf.middleware.ts";
import {
  errorHandler,
  notFoundHandler,
} from "@srvr/middlewares/error.middleware.ts";

import { envServerPort, MODE } from "@srvr/configs/env.config.ts";
import { csrfSynchronisedProtection } from "@srvr/configs/csrf.config.ts";
import vpnOnlyMiddleware from "@srvr/middlewares/vpn.middleware.ts";

const app = express();
let server;

// Initialize Data Storage
await Redis();
await Postgres();

// Middleware stack
app.use(corsMiddleware);
app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(csrfTokenMiddleware);
app.use(csrfSynchronisedProtection);

// Routes
await registerFeatures(app)

// Catch-all for unmatched /api/v1 routes
app.use("/api/v1", notFoundHandler);
app.use("/api/v1", errorHandler);

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

  const { default: vpnConnect } = await import("./configs/vpn.config.js");
  // enable vpn when not in development
  console.log("🔗 Connecting to VPN...");
  vpnConnect();
  app.use(vpnOnlyMiddleware)

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
registerWsFeature();

console.log(process.env.POSTGRES_URL)

//@ts-expect-error staging mode is not allowed
ViteExpress.config({ mode: MODE });
ViteExpress.bind(app, server);

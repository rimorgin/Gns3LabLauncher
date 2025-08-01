import ViteExpress from "vite-express";
import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import cookieParser from "cookie-parser";
import passport from "passport";

import Redis from "@srvr/database/redis.database.ts";
import Postgres from "@srvr/database/postgres.database.ts";

import registerFeatures from "@srvr/features/index.features.ts";

import corsMiddleware from "@srvr/middlewares/cors.middleware.ts";
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

// CRON JOBS
import "./cron";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize Data Storage
await Redis();
await Postgres();

// Middleware stack
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the 'public' directory
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use("/submissions", express.static(path.join(__dirname, "/submissions")));
console.log(
  "Serving static files from:",
  path.join(__dirname, "/public /submissions"),
);

// SECURITY

app.use(helmetMiddleware());
app.use(csrfTokenMiddleware);
app.use(csrfSynchronisedProtection);
// Reduce fingerprinting
app.disable("x-powered-by");
// prevent DDos or Brute Force
//app.use(rateLimiterMiddleware); //disable in development
// enforce single session only
//app.use(enforceSingleSessionOnly)
// enforce validation of session every client mounts

// LOGGING
app.use(loggerMiddleware);
// ERROR HANDLING
app.use(errorMiddleware);
if (MODE !== "development") {
  app.set("trust proxy", true);
  app.use((req, res, next) => {
    console.log("🔒 req.secure:", req.secure);
    console.log("📦 x-forwarded-proto:", req.get("x-forwarded-proto"));
    next();
  });
}

// Routes
await registerFeatures(app);

/* app.use("*", (req, res) => {
  res.sendFile(path.resolve("index.html"));
}); */

const server = http.createServer(app);
console.log(`🌐 HTTP server running in (${MODE})`);

export const io = new SocketIOServer(server);

server.listen(envServerPort, () => {
  console.log(`🚀 Server is listening on port ${envServerPort}`);
});

// initialize websocket connection handlers
webSocketListener();

//@ts-expect-error staging mode is not allowed
ViteExpress.config({ mode: MODE });
ViteExpress.bind(app, server);

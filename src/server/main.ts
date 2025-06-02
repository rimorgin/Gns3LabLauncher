import ViteExpress from "vite-express";
import express from 'express';
import http from 'http';
import https from 'https';
import { Server as SocketIOServer } from 'socket.io'
import path from 'path';
import fs from 'fs'
import cookieParser from 'cookie-parser';
import passport from 'passport';

import Redis from "@srvr/database/redis.database.ts";
import MongoDB from "@srvr/database/mongo.database.ts";
//import gridFileStorage from "@srvr/database/gridfs.database.ts";

import authRouter from "@srvr/routes/auth.route.ts";
import csrfRouter from "@srvr/routes/csrf.route.ts"
import indexRouter from "@srvr/routes/index.routes.ts";
import webSocketListener from "@srvr/routes/websocket.route.ts";

import loggerMiddleware from "@srvr/middlewares/logger.middleware.ts";
import sessionMiddleware from "@srvr/middlewares/session.middleware.ts";
import csrfTokenMiddleware from "@srvr/middlewares/csrf.middleware.ts";
import { errorHandler, notFoundHandler } from "@srvr/middlewares/error.middleware.ts";

import { envServerPort } from "@srvr/configs/env.config.ts";
import { csrfSynchronisedProtection } from "@srvr/configs/csrf.config.ts";

const app = express();
let server;

// Middleware stack
app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
//app.use(enforceSingleSessionOnly);
app.use(csrfTokenMiddleware);
app.use(csrfSynchronisedProtection)

// Initialize Data Storage
Redis()
MongoDB();

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1', csrfRouter);
app.use('/api/v1', indexRouter);


// Catch-all for unmatched /api/v1 routes
app.use('/api/v1', notFoundHandler);
app.use('/api/v1', errorHandler);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  const key = fs.readFileSync(path.resolve('./cert/vite-express.key.pem'), 'utf8');
  const cert = fs.readFileSync(path.resolve('./cert/vite-express.cert.pem'), 'utf8');

  server = https.createServer({ key, cert }, app);
  console.log('🌐 HTTPS server configured');
} else {
  server = http.createServer(app);
  console.log('🌐 HTTP server running (non-production)');
}

export const io = new SocketIOServer(server)
// initialize websocket connection handlers
webSocketListener()


server.listen(envServerPort, () => {
  console.log(`🚀 Server is listening on port ${envServerPort}`);
});


ViteExpress.bind(app, server);


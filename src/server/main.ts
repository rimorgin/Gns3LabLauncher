import ViteExpress from "vite-express";
import express from 'express';
import http from 'http';
import https from 'https';
import path from 'path';
import fs from 'fs'
import cookieParser from 'cookie-parser';
import passport from 'passport';

import authRouter from '@srvr/routes/auth.routes.js';
import csrfRouter from '@srvr/routes/csrf.route.js'
import indexRouter from '@srvr/routes/index.routes.js';

//import viewsMiddleware from '@srvr/middlewares/views.middleware.js';
import MongoDB from '@srvr/database/mongo.database.js';
import GridFileStorage from "./database/gridfs.database.js";

import loggerMiddleware from '@srvr/middlewares/logger.middleware.js';
import sessionMiddleware from '@srvr/middlewares/session.middleware.js';
import csrfMiddleware from '@srvr/middlewares/csrf.middleware.js';
//import vpnConnect from "@srvr/configs/vpn.config.js";
//import vpnOnlyMiddleware from "@srvr/middlewares/vpn.middleware.js";
import { envServerPort } from "@srvr/configs/env.config.js";
import {  errorHandler } from '@srvr/middlewares/error.middleware.js';

const app = express();

// app.locals setup
//app.locals.pluralize = pluralize;

// Middleware stack
app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(csrfMiddleware);
//app.use(vpnOnlyMiddleware);

// Initialize Connection to VPN Server
//vpnConnect()

// Initialize Data Storage
MongoDB();
GridFileStorage();

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1', csrfRouter);
app.use('/api/v1', indexRouter);


// Catch-all for unmatched /api/v1 routes
//app.use('/api/v1', notFoundHandler);
app.use('/api/v1', errorHandler);

let server;

if (process.env.NODE_ENV === 'production') {
  const key = fs.readFileSync(path.resolve('./cert/vite-express.key.pem'), 'utf8');
  const cert = fs.readFileSync(path.resolve('./cert/vite-express.cert.pem'), 'utf8');

  server = https.createServer({ key, cert }, app);
  console.log('🌐 HTTPS server configured');
} else {
  server = http.createServer(app);
  console.log('🌐 HTTP server running (non-production)');
}

server.listen(envServerPort, () => {
  console.log(`🚀 Server is listening on port ${envServerPort}`);
});

ViteExpress.bind(app, server);


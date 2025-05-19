import ViteExpress from "vite-express";

import express, { Request, Response, NextFunction } from 'express';
import http from 'http'
import path from 'path';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import authRouter from '@srvr/routes/auth.routes.js';
import csrfRouter from '@srvr/routes/csrf.route.js'
import indexRouter from '@srvr/routes/index.routes.js';

//import viewsMiddleware from '@srvr/middlewares/views.middleware.js';
import ConnectMongoDB from '@srvr/database/mongo.database.js';

import loggerMiddleware from '@srvr/middlewares/logger.middleware.js';
import sessionMiddleware from '@srvr/middlewares/session.middleware.js';
import csrfMiddleware, { verifyCsrfToken } from '@srvr/middlewares/csrf.middleware.js';
import { envServerPort } from "@srvr/configs/env.config.js";
import { notFoundHandler, errorHandler } from '@srvr/middlewares/error.middleware.js';

import pluralize from 'pluralize';

const app = express();

// Connect MongoDB
ConnectMongoDB();

// app.locals setup
app.locals.pluralize = pluralize;

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

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1', csrfRouter);
app.use('/api/v1', indexRouter);


// Catch-all for unmatched /api/v1 routes
app.use('/api/v1', notFoundHandler);
app.use('/api/v1', errorHandler);

const server = http.createServer(app).listen(envServerPort, () => {
   console.log("Server is listening!")
});
ViteExpress.bind(app, server);

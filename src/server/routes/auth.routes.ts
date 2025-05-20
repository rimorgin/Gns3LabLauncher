// routes/auth.routes.js

import express from 'express';
import passport from '@srvr/configs/passport.config.js';

import {
  getUser,
  postLogout,
  postSignup,
  getSession,
  postLogin
} from '@srvr/controllers/auth.controller.js';

import { checkAuthentication } from '../middlewares/auth.middleware.js';
import { csrfSync } from "csrf-sync";

const { csrfSynchronisedProtection } = csrfSync();

const router = express.Router();

router.get('/user', getUser);
router.post('/login', csrfSynchronisedProtection, postLogin);
router.post('/logout', postLogout);
router.post('/signup', postSignup);
router.get('/session', getSession);

export default router;
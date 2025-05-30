import express from 'express';
import {
  getUser,
  postLogout,
  postSignup,
  postLoginLocal,
  checkSession
} from '@srvr/controllers/auth.controller.js';
import { csrfSync } from "csrf-sync";

const { csrfSynchronisedProtection } = csrfSync();
const router = express.Router();

router.get('/user', getUser);
router.get('/session/check', checkSession);
router.post('/login-local', csrfSynchronisedProtection, postLoginLocal);
router.post('/login-microsoft', csrfSynchronisedProtection, postLoginLocal);
router.post('/logout', csrfSynchronisedProtection, postLogout);
router.post('/signup', csrfSynchronisedProtection, postSignup);


export default router;
import express from 'express';
import {
  getUser,
  postLogout,
  postSignup,
  postLogin
} from '@srvr/controllers/auth.controller.js';
import { csrfSync } from "csrf-sync";

const { csrfSynchronisedProtection } = csrfSync();
const router = express.Router();

router.get('/user', getUser);
router.post('/login', csrfSynchronisedProtection, postLogin);
router.post('/logout', csrfSynchronisedProtection, postLogout);
router.post('/signup', csrfSynchronisedProtection, postSignup);

export default router;
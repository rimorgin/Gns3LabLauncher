import { Router } from 'express'
import { getCsrf } from '@srvr/controllers/csrf.controller.js';

const router = Router();

router.get('/csrf-token', getCsrf)

export default router;
import { Router } from "express";
import { getCsrf } from "@srvr/controllers/csrf.controller.ts";

const router = Router();

/**
 * @route   GET /csrf-token
 * @desc    Retrieves a CSRF token for secure client-side form or API submissions
 * @access  Public
 */
router.get("/csrf-token", getCsrf);

export default router;

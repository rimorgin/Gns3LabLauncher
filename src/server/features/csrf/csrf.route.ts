import { Router } from "express";
import { getCsrf } from "./csrf.controller.ts";

const router = Router();

/**
 * @route   GET /csrf-token
 * @desc    Retrieves a CSRF token for secure client-side form or API submissions
 * @access  Public
 */
router.get("/", getCsrf);

export default router;

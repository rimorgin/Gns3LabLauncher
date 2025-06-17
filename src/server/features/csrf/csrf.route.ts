import { Router } from "express";
import { getCsrf } from "./csrf.controller.ts";

const router = Router();

/**
 * @route   GET /csrf-token
 * @desc    Retrieves a CSRF token for secure client-side form or API submissions
 * @access  Public
 */
//@ts-expect-error error in usage but its correct usage and import
router.get("/", getCsrf);

export default router;

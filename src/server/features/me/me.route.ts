import { checkAuthentication } from "@srvr/middlewares/auth.middleware.ts";
import { Router } from "express";
import { getMe, getUserPermissions } from "./me.controller.ts";
import { redisCache } from "@srvr/middlewares/redis-cache.middleware.ts";

const router = Router();

/**
 * @route   GET /me/permissions
 * @desc    Get current authenticated user's permissions based on their role.
 * @access  Authenticated users
 */
router.get(
  "/permissions",
  checkAuthentication,
  redisCache({ withUserId: true }),
  getUserPermissions,
);

/**
 * @route   GET /me
 * @desc    Fetches the currently authenticated user's data from the session
 * @access  Private (User must be logged in)
 */
router.get("/", checkAuthentication, getMe);

export default router;

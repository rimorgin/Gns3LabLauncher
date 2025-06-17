import { checkAuthentication, checkPermission } from "@srvr/middlewares/auth.middleware.ts";
import { redisCache } from "@srvr/middlewares/redis-cache.middleware.ts";
import { Router } from "express";
import { getUserPermissions, getUsers, postUsers } from "./users.controller.ts";

const router = Router()
/**
 * @route   GET /permissions
 * @desc    Get current authenticated user's permissions based on their role.
 * @access  Authenticated users
 */
router.get(
  "/permissions",
  checkAuthentication,
  redisCache({ withUserId: true }),
  getUserPermissions
);

/**
 * @route   GET /users
 * @desc    Fetch list of users filtered by optional query parameter `role`.
 * @access  Authenticated users with 'read_users' permission
 */
router.get(
  "/",
  checkAuthentication,
  checkPermission(["read_users"]),
  getUsers
);

/**
 * @route   POST /users
 * @desc    Create a new user.
 * @access  Authenticated users with 'create_users' permission
 */
router.post(
  "/",
  checkAuthentication,
  checkPermission(["create_users"]),
  postUsers
);

export default router;
import express from "express";
import {
  getUser,
  postLogout,
  postSignup,
  postLoginLocal,
  checkSession,
  getUserPermissions,
} from "@srvr/features/auth/auth.controller.ts";
import { checkAuthentication } from "@srvr/middlewares/auth.middleware.ts";
import { redisCache } from "@srvr/middlewares/redis-cache.middleware.ts";

const router = express.Router();

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
 * @route   GET /user
 * @desc    Fetches the currently authenticated user's data from the session
 * @access  Private (User must be logged in)
 */
router.get("/user", checkAuthentication, getUser);

/**
 * @route   GET /session/check
 * @desc    Checks if the current session is valid and the user is authenticated
 * @access  Public
 */
router.get("/session-check", checkSession);

/**
 * @route   POST /login-local
 * @desc    Authenticates a user using local email/password strategy with CSRF protection
 * @access  Public
 */
router.post("/login-local", postLoginLocal);

/**
 * @route   POST /login-microsoft
 * @desc    Initiates Microsoft OAuth login flow with CSRF protection
 * @access  Public
 */
router.post("/login-microsoft", postLoginLocal);

/**
 * @route   POST /logout
 * @desc    Logs out the current user, destroys session, and clears Redis session data
 * @access  Private (User must be logged in)
 */
router.post("/logout", postLogout);

/**
 * @route   POST /signup
 * @desc    Registers a new user and logs them in automatically after successful signup
 * @access  Public
 */
router.post("/signup", postSignup);

export default router;

import express from "express";
import {
  postLogout,
  postSignup,
  postLoginLocal,
  checkSession,
} from "@srvr/features/auth/auth.controller.ts";

const router = express.Router();

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

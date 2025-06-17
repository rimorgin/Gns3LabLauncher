/**
 * @fileoverview WebSocket handler module for managing real-time connections with session validation,
 *               user presence tracking, and preventing multiple concurrent sessions per user.
 *
 * @description This module ensures:
 * - Integration between Socket.IO and Express session middleware for shared session data.
 * - Only one active session per user (using Redis as a centralized store).
 * - Real-time disconnection of older sessions when a new login occurs.
 * - Tracking of current socket and session IDs in Redis for cross-service communication.
 *
 * @module webSocketHandlers
 */

import { onSocketConnection } from "@srvr/features/websocket/websocket.controller.ts";
import { io } from "@srvr/main.ts";
import sessionMiddleware from "@srvr/middlewares/session.middleware.ts";
import { wrapExpressMiddlewareForSocket } from "@srvr/utils/session-ws.utils.ts";
import passport from "passport";

/**
 * Initializes WebSocket event handlers and session management logic.
 *
 * Applies Express-style middleware (session and Passport) to Socket.IO engine
 * and registers the main connection handler for real-time events.
 *
 * @function webSocketListener
 * @returns {void}
 */
export default function webSocketListener(): void {
  // Apply Express session middleware to Socket.IO engine
  // This allows WebSocket connections to access session data like req.session
  io.engine.use(wrapExpressMiddlewareForSocket(sessionMiddleware));

  // Apply Passport session middleware to authenticate users via WebSocket
  io.engine.use(wrapExpressMiddlewareForSocket(passport.session()));

  // Register the main connection handler for each new WebSocket client
  io.on("connection", onSocketConnection);
}

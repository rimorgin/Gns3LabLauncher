/**
 * @fileoverview WebSocket handler module for managing real-time connections with session validation,
 *              user presence tracking, and preventing multiple concurrent sessions per user.
 *
 * @description This module:
 * - Integrates Socket.IO with Express session middleware to share session data between HTTP and WebSocket layers.
 * - Ensures only one active session per user using Redis as the session store.
 * - Disconnects older connections when a user logs in from a new device/location.
 * - Stores and updates current socket and session IDs in Redis for real-time tracking.
 *
 * @module webSocketHandlers
 */

import { redisClient } from "@srvr/database/redis.database.ts";
import { io } from "@srvr/main.ts";
import sessionMiddleware from "@srvr/middlewares/session.middleware.ts";
import { forceLogoutUserBySessionID, getSocket, wrapExpressMiddlewareForSocket } from "@srvr/utils/session-ws.utils.ts";
import passport from "passport";

/**
 * Initializes WebSocket event handlers and session management logic.
 *
 * @function webSocketHandlers
 */
export default function webSocketHandlers() {
  // Use Express-compatible session and Passport middleware for WebSocket (Socket.IO) connections
  io.engine.use(wrapExpressMiddlewareForSocket(sessionMiddleware));
  io.engine.use(wrapExpressMiddlewareForSocket(passport.session()));

  /**
   * Event listener for new WebSocket connections.
   *
   * @param {Socket} socket - The connected client socket.
   */
  io.on("connection", async (socket) => {
    const userId = socket.request.session?.passport?.user;
    const currentSocketId = socket.id;
    const currentSessionId = socket.request.sessionID;

    // If no authenticated user ID found in session, disconnect the socket
    if (!userId) return socket.disconnect();

    const redisKey = `gns3labuser:session:${userId}`;
    const sessionRecord = await redisClient.hGetAll(redisKey);

    const previousSessionId = sessionRecord.sessionID;
    const previousSocketId = sessionRecord.socketID;

    // If there's a previous session and it's different from the current one
    if (previousSessionId && previousSessionId !== currentSessionId) {
      const oldSocket = getSocket(previousSocketId);

      // Notify and disconnect the old session's socket
      if (oldSocket) {
        console.log(`🛑 Found old socket ${previousSocketId}, disconnecting...`);
        oldSocket.emit("session-kicked", { reason: "You were logged in elsewhere." });
        oldSocket.disconnect();
      }

      // Force logout the previous session from Redis and session store
      try {
        await forceLogoutUserBySessionID(previousSessionId);
      } catch {
        console.warn(`Failed to destroy session ${previousSessionId}`);
      }
    }

    // Save the current session and socket ID in Redis
    await redisClient.hSet(redisKey, {
      sessionID: currentSessionId,
      socketID: currentSocketId,
    });

    console.log(`🔌 User ${userId} connected with socket ${currentSocketId}`);

    // Join a room specific to this user for targeted messaging
    socket.join(`active_user:${userId}`);
  });
}
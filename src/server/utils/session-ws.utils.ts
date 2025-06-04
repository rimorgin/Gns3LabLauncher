import { IncomingMessage, ServerResponse } from "http";
import { RequestHandler } from "express";
import { io } from "@srvr/main.ts";
import { redisStore } from "@srvr/database/redis.database.ts";

/**
 * Retrieves a connected Socket.IO client by its socket ID.
 *
 * Useful when you need to interact directly with a specific client connection.
 *
 * @param {string} id - The socket ID to look up.
 * @returns {Socket | undefined} The socket instance if found, otherwise undefined.
 */
export const getSocket = (id: string) => {
  return io.sockets.sockets.get(id);
};

/**
 * Forces a user to log out by destroying their session in Redis.
 *
 * This is useful for administrative actions or invalidating sessions on security events.
 *
 * @param {string} sessionID - The session ID to destroy.
 * @returns {Promise<boolean>} A promise that resolves to true if successful, false otherwise.
 */
export const forceLogoutUserBySessionID = (
  sessionID: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    redisStore.destroy(sessionID, (err) => {
      if (err) {
        console.error("Failed to destroy session:", sessionID, err);
        return reject(false);
      }
      console.log(`✅ Destroyed session: ${sessionID}`);
      return resolve(true);
    });
  });
};

/**
 * Wraps an Express middleware so that it can be used during the Socket.IO handshake.
 *
 * This allows sharing session context (`req.session`) between Express routes and Socket.IO connections.
 *
 * @param {RequestHandler} middleware - The Express middleware to wrap.
 * @returns {(req: IncomingMessage, res: ServerResponse, next: Function) => void}
 */
export const wrapExpressMiddlewareForSocket =
  (middleware: RequestHandler) =>
  (req: IncomingMessage, res: ServerResponse, next: (err?: any) => void) => {
    middleware(req as any, res as any, next);
  };

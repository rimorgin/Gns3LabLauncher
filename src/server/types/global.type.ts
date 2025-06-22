import { User } from "@prisma/client";
import { Session, SessionData } from "express-session";

/**
 * Represents the possible environment modes for the application.
 * Can be 'production', 'development', or 'staging'.
 */
export type ModeTypes = "production" | "development" | "staging";

declare module "express-session" {
  /**
   * Augments the express-session's SessionData interface to include custom properties.
   */
  interface SessionData {
    /**
     * Optional property to store passport-related user information in the session.
     */
    passport?: {
      /**
       * The user identifier stored by passport.
       */
      user: string;
    };
    /**
     * The date and time when the user logged in.
     */
    loginTime: Date;
  }
}

declare module "http" {
  /**
   * Augments the http.IncomingMessage interface to include session and user properties.
   */
  interface IncomingMessage {
    /**
     * The session object associated with the request.
     */
    session: Session & Partial<SessionData>;
    /**
     * The session ID associated with the request.
     */
    sessionID: string;
    /**
     * Optional property to store the user object associated with the request.
     */
    user?: User;
  }
}

declare module "express-serve-static-core" {
  /**
   * Augments the express Request interface to include user and authentication properties.
   */
  interface Request {
    /**
     * Optional property to store the user object associated with the request.
     */
    user?: User;
    /**
     * Function to check if the user is authenticated.
     * @returns {boolean} True if the user is authenticated, false otherwise.
     */
    isAuthenticated: () => boolean;
  }
}

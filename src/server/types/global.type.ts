import { Session, SessionData } from "express-session";
import { IUser } from "./usermodel.type.ts";

export type ModeTypes = "production" | "development" | "staging";
declare module "express-session" {
  interface SessionData {
    passport?: {
      user: string;
    };
    loginTime: Date;
  }
}

declare module "http" {
  interface IncomingMessage {
    session: Session & Partial<SessionData>;
    sessionID: string;
    user?: IUser;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
    isAuthenticated: () => boolean;
  }
}

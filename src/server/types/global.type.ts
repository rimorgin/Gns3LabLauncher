import { Session, SessionData } from "express-session";
import { IUser } from "./usermodel.type.ts";

declare module 'express-session' {
  interface SessionData {
    csrfSecret?: string;
    passport?: {
      user: string;
    };
    loginTime: Date
  }
}

declare module "http" {
  interface IncomingMessage {
    session: Session & Partial<SessionData>;
    sessionID: string;
  }
}

declare module 'express-serve-static-core'{
  interface Request {
    user?: IUser;
    isAuthenticated: () => boolean;
  }
}
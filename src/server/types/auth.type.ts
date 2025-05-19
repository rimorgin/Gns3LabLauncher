import { Request } from "express";
import { IUser } from "./usermodel.auth.js";

export interface isAuthenticatedRequest extends Request {
  user?: IUser
  isAuthenticated: () => boolean;
}

export interface authenticatedRoleRequest extends Request {
  user?: { role: string };
  session?: { messages?: string[] };
}

export interface rolesRequest {
  roles: { name: string; permissions: string[]; }[];
}

declare module 'express-session' {
  interface SessionData {
    passport?: {
      user: string | Record<string, any>;
    };
  }
}
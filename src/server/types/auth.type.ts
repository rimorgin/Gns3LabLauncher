import { Request } from "express";
import { IUser } from "./usermodel.auth.js";

// === Role Name Type ===
export type RoleName = 'administrator' | 'instructor' | 'student';

// === Permission Type ===
export type Permission =
  | "read_dashboard"
  | "create_tasks" | "read_tasks" | "update_tasks" | "delete_tasks"
  | "create_teams" | "read_teams" | "update_teams" | "delete_teams"
  | "create_projects" | "read_projects" | "update_projects" | "delete_projects"
  | "create_users" | "read_users" | "update_users" | "delete_users"
  | "create_classrooms" | "read_classrooms" | "update_classrooms" | "delete_classrooms"
  | "create_comments" | "read_comments" | "update_comments" | "delete_comments"
  | "read_analytics"
  | "read_completions"
  | "read_settings"
  | "create_notifications" | "read_notifications" | "update_notifications" | "delete_notification"
  | "read_security" | "update_security";

// === Role Interface ===
export interface Role {
  name: RoleName;
  permissions: Permission[];
}

// === Roles Collection ===
export interface RolesCollection {
  roles: Role[];
}

export interface isAuthenticatedRequest {
  user?: IUser
  isAuthenticated: () => boolean;
}


export interface authenticatedRoleRequest extends Request {
  user?: IUser;
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
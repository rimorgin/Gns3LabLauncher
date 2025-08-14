import { NextFunction, Response, Request } from "express";
import roles from "@srvr/configs/roles.config.ts";
import { Permission } from "@srvr/types/auth.type.ts";
import { getRolePermissions } from "@srvr/utils/db/helpers.ts";
import {
  APP_RESPONSE_MESSAGE,
  HttpStatusCode,
} from "@srvr/configs/constants.config.ts";

export const checkAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.isAuthenticated?.() || !req.user) {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: APP_RESPONSE_MESSAGE.user.userUnauthorized,
    });
    return;
  }

  next();
};

export const checkPermission = (requiredPermissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role || "student";
    const perms = getRolePermissions(roles, userRole);
    const hasPermissions = requiredPermissions.every((p) => perms.includes(p));

    if (!hasPermissions) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: APP_RESPONSE_MESSAGE.user.userDoesntHavePerms,
      });
      return;
    }
    //console.log("authorized");
    next();
  };
};

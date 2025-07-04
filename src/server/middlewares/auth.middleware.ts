import { NextFunction, Response, Request } from "express";
import roles from "@srvr/configs/roles.config.ts";
import { Permission } from "@srvr/types/auth.type.ts";
import { getRolePermissions } from "@srvr/utils/db/helpers.ts";
import { redisClient, redisStore } from "@srvr/database/redis.database.ts";
import {
  APP_RESPONSE_MESSAGE,
  HttpStatusCode,
} from "@srvr/configs/constants.config.ts";

export const checkAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.isAuthenticated?.()) {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: APP_RESPONSE_MESSAGE.user.userUnauthorized,
    });
    return;
  }
  console.log("authenticated");
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
    console.log("authorized");
    next();
  };
};

export async function enforceSingleSessionOnly(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.session?.passport?.user;
  if (!userId) return next();

  console.log("🚀 ~ userId:", userId);
  const userKey = `gns3labuser:session:${userId}`;

  const currentSessionId = req.sessionID;
  //console.log("🚀 ~ userKey:", userKey);
  const oldSessionId = await redisClient.get(userKey);

  // No existing session → just set current
  if (!oldSessionId) {
    await redisClient.set(userKey, currentSessionId);
    return next();
  }

  // Existing session is different → destroy it
  if (oldSessionId !== currentSessionId) {
    console.log(
      "🚀 ~ oldSessionId !== currentSessionId:",
      oldSessionId !== currentSessionId,
    );
    await new Promise<void>((resolve) => {
      redisStore.destroy(oldSessionId, (err) => {
        if (err) console.error("❌ Failed to destroy old session:", err);
        else console.log(`✅ Old session (${oldSessionId}) destroyed`);
        resolve();
      });
    });

    await redisClient.set(userKey, currentSessionId);
  }

  return next();
}

import { NextFunction, Response, Request } from "express";
import roles from "@srvr/configs/roles.config.ts";
import { Permission } from "@srvr/types/auth.type.ts";
import { getRolePermissions } from "@srvr/utils/user-helpers.utils.ts";
import { redisClient, redisStore } from "@srvr/database/redis.database.ts";

export const checkAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.isAuthenticated()) {
    return res.redirect("/signin");
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
      res.status(403).json({
        message:
          "Forbidden: You do not have permission to access this resource.",
      });
      return;
    }
    console.log("authorized");
    next();
  };
};

export default async function enforceSingleSessionOnly(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.session?.passport?.user;
  if (!userId) return next();

  const userKey = `gns3labuser:session:${userId}`;
  const currentSessionId = req.sessionID;
  console.log("🚀 ~ userKey:", userKey);
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

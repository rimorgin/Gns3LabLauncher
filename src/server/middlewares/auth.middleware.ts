import { NextFunction, Response, Request } from 'express';
import roles from '@srvr/configs/roles.config.js';
import { authenticatedRoleRequest, isAuthenticatedRequest, Permission } from '@srvr/types/auth.type.js';
import { getRolePermissions } from '@srvr/utils/user-helpers.utils.js';
import { redisClient, redisStore } from '@srvr/database/redis.database.js';
import { IUser } from '@srvr/types/usermodel.type.js';

export const checkAuthentication = (
  req: Request, res: Response, next: NextFunction
): void => {
  const authReq = req as isAuthenticatedRequest;

  if (!authReq.isAuthenticated()) {
    return res.redirect('/signin');
  }
  console.log('authenticated')
  next();
};

export const checkPermission = (requiredPermissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as authenticatedRoleRequest
    const userRole = authReq.user?.role || 'student';
    const perms = getRolePermissions(roles, userRole);
    const hasPermissions = requiredPermissions.every(p => perms.includes(p));

    if (!hasPermissions) {
      res.status(403).json({
        message: 'Forbidden: You do not have permission to access this resource.',
      });
      return;
    }
    console.log('authorized')
    next();
  };
};

export default async function enforceSingleSessionOnly(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = (req.user as IUser)?._id;
  if (!userId) return next();

  const userKey = `gns3labuser:session:${String(userId)}`;
  const currentSessionId = req.sessionID; // Or req.session.id depending on config
  const oldSessionId = await redisClient.get(userKey);

  // First-time login
  if (!oldSessionId) {
    await redisClient.set(userKey, currentSessionId);
    return next();
  }

  // Same session — allow
  if (currentSessionId === oldSessionId) {
    return next();
  }

  // Revoke previous session
  try {
    redisStore.destroy(oldSessionId, (err) => {
      if (err) {
        console.error("Failed to destroy old session", err);
      } else {
        console.log(`✅ Old session (${oldSessionId}) destroyed`);
      }
    });

    // Update Redis with new session ID
    await redisClient.set(userKey, currentSessionId);

    return next();
  } catch (error) {
    console.error("Error enforcing single session", error);
    res.status(500).json({ message: "Internal server error" });
    return
  }
}

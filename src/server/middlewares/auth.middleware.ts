import { NextFunction, Response, Request } from 'express';
import roles from '@srvr/configs/roles.config.js';
import { authenticatedRoleRequest, isAuthenticatedRequest, Permission } from '@srvr/types/auth.type.js';
import { getRolePermissions } from '@srvr/utils/user-helpers.utils.js';

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

/*
// Check if the user has the required permission for a route
exports.checkPermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user ? req.user.role : 'anonymous';
    const userPermissions = new Permissions().getPermissionsByRoleName(userRole);

    if (userPermissions.includes(permission)) {
      return next();
    } else {
      req.session.messages = ['Forbidden: You do not have permission to access this resource.'];
      return res.redirect('/');
    }
  };
};
*/

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
import { NextFunction, Response, Request } from 'express';
import roles from '@srvr/configs/roles.config.js';
import { authenticatedRoleRequest, isAuthenticatedRequest } from '@srvr/types/auth.type.js';

export const checkAuthentication = (
  req: Request, res: Response, next: NextFunction
): void => {
  const authReq = req as isAuthenticatedRequest;

  if (!authReq.isAuthenticated || !authReq.isAuthenticated()) {
    return res.redirect('/auth/login');
  }
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

export const checkPermission = (requiredPermissions: []) => {
  return (req: authenticatedRoleRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role || 'anonymous';
    const userRoleData = roles.roles.find(role => role.name === userRole);
    if (!userRoleData || !requiredPermissions.every(perm => userRoleData.permissions.includes(perm))) {
      if (req.session) return req.session.messages = ['Forbidden: You do not have permission to access this resource.'];
    }
    next();
  };
};
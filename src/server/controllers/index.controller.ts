import roles from '@srvr/configs/roles.config.js';
import { isAuthenticatedRequest } from '@srvr/types/auth.type.js';
import { getRolePermissions } from '@srvr/utils/user-helpers.utils.js';
import { Request, Response, RequestHandler } from 'express';

export const getUserPermissions: RequestHandler = (req, res) => {
  const user = (req as isAuthenticatedRequest).user;

  if (!user || !user.role) {
    res.status(401).json({ message: 'Unauthorized or role missing' });
    return;
  }

  const permissions = getRolePermissions(roles, user.role);
  if (!permissions.length) {
    res.status(403).json({ message: 'Role not recognized or has no permissions' });
    return;
  }

  res.json({ permissions });
};

export const getIndex = (req: Request, res: Response): void => {
  console.log(req.user);
  res.json('authorize')
};

export const getUsers = (req: Request, res: Response): void => {
  console.log(req.user);
  res.render('main/users', {
    user: req.user,
    //csrfToken: req.csrfToken(),
  });
};


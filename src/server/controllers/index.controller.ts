/**
 * @fileoverview Controller module for handling user permissions and protected route access.
 *
 * This module includes controllers to:
 * - Retrieve current user's permissions based on their role
 * - Render or respond to protected routes (e.g., dashboard)
 *
 * @module permissions.controller
 */

import roles from '@srvr/configs/roles.config.ts';
import { getRolePermissions } from '@srvr/utils/user-helpers.utils.ts';
import { Request, Response } from 'express';

/**
 * Fetches the permissions associated with the currently authenticated user's role.
 *
 * @function getUserPermissions
 * 
 * @param {Request} req - Express request object containing authenticated user data.
 * @param {Response} res - Express response object to send permission data or error messages.
 * 
 * @returns {void} Sends:
 *  - 200 JSON with list of permissions if successful
 *  - 401 Unauthorized if user is not authenticated or has no role
 *  - 403 Forbidden if role is unrecognized or has no permissions
 */
export const getUserPermissions = (req: Request, res: Response): void => {
  const userRole = req.user?.role;

  if (!userRole) {
    res.status(401).json({ message: 'Unauthorized or role missing' });
    return;
  }

  const permissions = getRolePermissions(roles, userRole);
  if (!permissions.length) {
    res.status(403).json({ message: 'Role not recognized or has no permissions' });
    return;
  }

  res.json({ permissions });
};

/**
 * Handler for the root protected route (`GET /`).
 *
 * Used to verify that authentication and session are working correctly.
 *
 * @function getIndex
 * 
 * @param {Request} req - Express request object containing session and user data.
 * @param {Response} res - Express response object to reply with simple authorization confirmation.
 * 
 * @returns {void} Sends a simple JSON response confirming authorization.
 */
export const getIndex = (req: Request, res: Response): void => {
  console.log(req.user);
  res.json('authorize');
};

/**
 * Renders the users management page after ensuring the user is authenticated.
 *
 * Currently logs the user object and renders a view named `main/users`.
 *
 * @function getUsers
 * 
 * @param {Request} req - Express request object containing session and user data.
 * @param {Response} res - Express response object used to render the view.
 * 
 * @returns {void} Renders the `main/users` view template with user context.
 */
export const getUsers = (req: Request, res: Response): void => {
  console.log(req.user);
  res.render('main/users', {
    user: req.user,
    //csrfToken: req.csrfToken(),
  });
};
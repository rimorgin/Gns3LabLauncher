import {
  APP_RESPONSE_MESSAGE,
  HTTP_RESPONSE_CODE,
} from "@srvr/configs/constants.config.ts";
import { Request, Response } from "express";
import { MeService } from "./me.service.ts";
import roles from "@srvr/configs/roles.config.ts";

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const userSessionId = req.session?.passport?.user;
  const user = await MeService.profile(userSessionId);
  if (!user) {
    res
      .status(HTTP_RESPONSE_CODE.NOT_FOUND)
      .json({ message: APP_RESPONSE_MESSAGE.user.userDoesntExist });
    return;
  }

  res.json({ user });
};

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
export const getUserPermissions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userRole = req.user?.role;

  if (!userRole) {
    res
      .status(HTTP_RESPONSE_CODE.UNAUTHORIZED)
      .json({ message: "Unauthorized or role missing" });
    return;
  }

  const permissions = await MeService.permissions(roles, userRole);
  if (!permissions.length) {
    res
      .status(403)
      .json({ message: "Role not recognized or has no permissions" });
    return;
  }

  res.json({ permissions });
};

/* // for student only
export const getUserProgresses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userSessionId = req.session?.passport?.user;

};
*/

import { UserRolesEnum } from "@prisma/client";
import prisma from "@srvr/utils/db/prisma.ts";
import { Request, Response } from "express";
import { createUser } from "./users.service.ts";
import { getRolePermissions } from "@srvr/utils/db/helpers.ts";
import roles from "@srvr/configs/roles.config.ts";

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
    res.status(401).json({ message: "Unauthorized or role missing" });
    return;
  }

  const permissions = getRolePermissions(roles, userRole);
  if (!permissions.length) {
    res
      .status(403)
      .json({ message: "Role not recognized or has no permissions" });
    return;
  }

  res.json({ permissions });
};

/**
 * Fetches a list of users filtered by role (excluding administrators by default).
 *
 * If a `role` query parameter is provided, it filters users by that exact role.
 * Otherwise, it fetches all non-administrator users.
 *
 * @function getUsers
 *
 * @param {Request} req - Express request object containing session and user data.
 * @param {Response} res - Express response object to send JSON response.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 JSON array of user objects matching the filter
 *  - 500 Internal Server Error if database query fails
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, only_ids, partial } = req.query;

    let select = undefined;

    const whereCondition = role
      ? { role: role as UserRolesEnum }
      : { role: { not: UserRolesEnum.administrator } };

    if (only_ids) {
      select = { id: true };
    } else if (partial) {
      select = {
        id: true,
        name: true,
        email: true,
        role: true,
      };
    }

    const users = await prisma.user.safeFindMany({
      where: whereCondition,
      ...(select && { select }),
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


/**
 * Handles user creation via POST request.
 *
 * Validates if a user with the provided username or email already exists.
 * If not, creates a new user using the request body.
 *
 * @function postUsers
 *
 * @param {Request} req - Express request object containing user data in the body (e.g., username, email).
 * @param {Response} res - Express response object to send success or error messages.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 JSON indicating successful user creation
 *  - 409 Conflict if user with given username or email already exists
 *  - 500 Internal Server Error if an exception occurs during creation
 */
export const postUsers = async (req: Request, res: Response): Promise<void> => {
  const { username, email } = req.body;

  const [emailExists, usernameExists] = await prisma.$transaction([
    prisma.user.findUnique({ where: { email } }),
    prisma.user.findUnique({ where: { username } }),
  ]);

  if (emailExists || usernameExists) {
    const msg = [
      emailExists ? `Email ${email}` : null,
      usernameExists ? `Username ${username}` : null,
    ].filter(Boolean).join(" and ");
    res.status(409).json({ message: `${msg} already exists.` });
    return;
  }

  const newUser = await createUser(req.body);
  res.status(201).json({ message: "User Created", newData: newUser });
};

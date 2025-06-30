import { Prisma, UserRolesEnum } from "@prisma/client";
import prisma from "@srvr/utils/db/prisma.ts";
import { Request, Response } from "express";
import {
  createUser,
  deleteManyUsersById,
  deleteUserById,
  updateUserById,
} from "./users.service.ts";
import { APP_RESPONSE_MESSAGE } from "@srvr/configs/constants.config.ts";

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
    const { role, only_ids, includeRoleData, includeRoleRelations } = req.query;

    // Role filter
    const where: Prisma.UserWhereInput = role
      ? { role: role as UserRolesEnum }
      : { role: { not: UserRolesEnum.administrator } };

    // Handle selection fields
    let select: Prisma.UserSelect | undefined;
    let selectRelation: Prisma.UserSelect | undefined;

    if (only_ids === "true") {
      select = { id: true };
    } else {
      select = {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        student: includeRoleData
          ? {
              select: {
                userGroups: includeRoleRelations ? true : false,
                classrooms: includeRoleRelations ? true : false,
                isOnline: true,
                lastActiveAt: true,
              },
            }
          : false,
        instructor: includeRoleData
          ? {
              select: {
                classrooms: includeRoleRelations ? true : false,
                expertise: includeRoleRelations ? true : false,
                isOnline: true,
                lastActiveAt: true,
              },
            }
          : false,
      };
    }
    const combinedSelect = { ...select, ...selectRelation };

    const users = await prisma.user.findMany({
      where,
      ...(combinedSelect && { select: combinedSelect }),
    });

    res.status(200).json({
      message: APP_RESPONSE_MESSAGE.usersReturned,
      users: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
    ]
      .filter(Boolean)
      .join(" and ");
    res
      .status(409)
      .json({ message: `${msg} ${APP_RESPONSE_MESSAGE.userDoesExist}` });
    return;
  }

  const newUser = await createUser(req.body);
  res
    .status(201)
    .json({ message: APP_RESPONSE_MESSAGE.userCreated, newData: newUser });
};

/**
 * Handles updating a user by ID via PATCH request.
 *
 * Retrieves the `id` from the request URL and updates the user with the provided body data.
 *
 * @function patchUser
 *
 * @param {Request} req - Express request object containing `id` as a URL parameter and updated user data in the body.
 * @param {Response} res - Express response object to send success or error messages.
 *
 * @returns {Promise<void>} Sends:
 *  - 201 JSON indicating successful user update
 *  - 500 Internal Server Error if an exception occurs during the update
 */
export const patchUser = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  const updatedUser = await updateUserById(id, req.body);
  res
    .status(200)
    .json({ message: APP_RESPONSE_MESSAGE.userUpdated, newData: updatedUser });
};

/**
 * Handles deleting a user by ID via DELETE request.
 *
 * Retrieves the `id` from the request URL and deletes the corresponding user.
 *
 * @function deleteUser
 *
 * @param {Request} req - Express request object containing `id` as a URL parameter.
 * @param {Response} res - Express response object to send success or error messages.
 *
 * @returns {Promise<void>} Sends:
 *  - 201 JSON indicating successful user deletion
 *  - 500 Internal Server Error if an exception occurs during deletion
 */
export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;
  console.log("🚀 ~ id:", id);
  try {
    const deletedUser = await deleteUserById(id);
    res.status(200).json({
      message: APP_RESPONSE_MESSAGE.userDeleted,
      newData: deletedUser,
    });
  } catch {
    res.status(500).json({
      message: APP_RESPONSE_MESSAGE.serverError,
    });
  }
  return;
};

export const deleteUsersMany = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const ids = req.body.ids;

    if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string")) {
      res
        .status(400)
        .json({ message: "Invalid 'ids' format. Expected string array." });
      return;
    }

    const deletedUsers = await deleteManyUsersById(ids);

    res.status(200).json({
      message: APP_RESPONSE_MESSAGE.userDeleted,
      newData: deletedUsers,
    });
  } catch {
    res.status(500).json({ message: "Failed to delete users." });
  }
  return;
};

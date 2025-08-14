import prisma from "@srvr/utils/db/prisma.ts";
import { NextFunction, Request, Response } from "express";
import { UserService } from "./users.service.ts";
import {
  APP_RESPONSE_MESSAGE,
  HTTP_RESPONSE_CODE,
} from "@srvr/configs/constants.config.ts";
import { DuplicateUserError } from "@srvr/error/duplicate-entity.error.ts";
import { ValidationInputError } from "@srvr/error/validation-input.error.ts";

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
    const users = await UserService.getAll(req.query);

    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: APP_RESPONSE_MESSAGE.user.usersReturned,
      users,
    });
  } catch {
    res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ message: APP_RESPONSE_MESSAGE.server.error });
  }
};

/**
 * Fetches a user by id.
 *
 * @function getUserById
 *
 * @param {Request} req - Express request object containing session and user data.
 * @param {Response} res - Express response object to send JSON response.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 JSON array of user objects matching the filter
 *  - 500 Internal Server Error if database query fails
 */

export const getUserById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;
  try {
    const users = await UserService.getById(id, req.query);

    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: APP_RESPONSE_MESSAGE.user.usersReturned,
      users,
    });
  } catch {
    res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ message: APP_RESPONSE_MESSAGE.server.error });
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
export const postUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { username, email } = req.body;
  try {
    const [emailExists, usernameExists] = await prisma.$transaction([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { username } }),
    ]);

    if (emailExists || usernameExists) {
      throw new DuplicateUserError(
        emailExists ? email : undefined,
        usernameExists ? username : undefined,
      );
    }
    const newUser = await UserService.create(req.body);
    res.status(HTTP_RESPONSE_CODE.CREATED).json({
      message: APP_RESPONSE_MESSAGE.user.userCreated,
      newData: newUser,
    });
  } catch (error) {
    return next(error);
  }
};

export const bulkPostUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //console.log("🚀 ~ bulkPostUsers ~ req.body:", req.body);

    // make sure to extract the array
    const { users } = req.body;
    /* 
    if (!Array.isArray(users) || users.length === 0) {
      res
        .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
        .json({ message: "No users provided" });
      return;
    } */

    const createdUsers = await UserService.createBulk(users);

    res.status(HTTP_RESPONSE_CODE.CREATED).json({
      message: `${createdUsers.length} users created successfully`,
      data: createdUsers,
    });
    return;
  } catch (err) {
    console.error("bulkPostUsers error:", err);
    next(err);
  }
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

  try {
    const updatedUser = await UserService.updateById(id, req.body);
    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: APP_RESPONSE_MESSAGE.user.userUpdated,
      newData: updatedUser,
    });
  } catch {
    res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ message: APP_RESPONSE_MESSAGE.server.error });
  }
  return;
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
  next: NextFunction,
): Promise<void> => {
  const id = req.params.id;
  if (id) {
    throw new ValidationInputError([id]);
  }
  try {
    const deletedUser = await UserService.deleteById(id);
    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: APP_RESPONSE_MESSAGE.user.userDeleted,
      newData: deletedUser,
    });
  } catch (error) {
    next(error);
  }
  return;
};

export const deleteUsersMany = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const ids = req.body.ids;

    if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string")) {
      throw new ValidationInputError([ids]);
    }

    const deletedUsers = await UserService.deleteManyById(ids);

    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: APP_RESPONSE_MESSAGE.user.userDeleted,
      newData: deletedUsers,
    });
  } catch (error) {
    next(error);
  }
  return;
};

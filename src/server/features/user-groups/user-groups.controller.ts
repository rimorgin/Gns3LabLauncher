import prisma from "@srvr/utils/db/prisma.ts";
import { Request, Response } from "express";
import {
  createUserGroup,
  deleteUserGroupById,
  updateUserGroupById,
} from "./user-groups.service.ts";
import { APP_RESPONSE_MESSAGE } from "@srvr/configs/constants.config.ts";

/**
 * Retrieves all user groups from the database.
 *
 * @function getUserGroups
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends:
 *  - 200 JSON containing the list of user groups.
 *  - 500 Internal Server Error on failure.
 */
export const getUserGroups = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userGroups = await prisma.userGroups.findMany();

    res.status(200).json({
      message: APP_RESPONSE_MESSAGE.userGroupsReturned,
      user_groups: userGroups,
    });
  } catch (error) {
    console.error("Error fetching user groups:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Retrieves a user groups by id from the database.
 *
 * @function getUserGroups
 * @param {Request} req - Express request object and must contain `id` in params.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends:
 *  - 200 JSON containing the list of user groups.
 *  - 500 Internal Server Error on failure.
 */
export const getUserGroupById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;
  try {
    const userGroup = await prisma.userGroups.findUnique({
      where: { id },
    });

    res.status(200).json({
      message: APP_RESPONSE_MESSAGE.userGroupReturned,
      user_groups: userGroup,
    });
  } catch (error) {
    console.error("Error fetching user groups:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Creates a new user group.
 *
 * @function postUserGroup
 * @param {Request} req - Express request object containing `groupName` and optional `studentIds` in the body.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends:
 *  - 201 JSON indicating successful user group creation.
 *  - 500 Internal Server Error on failure.
 */
export const postUserGroup = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const newUserGroup = await createUserGroup(req.body);
  res.status(201).json({
    message: APP_RESPONSE_MESSAGE.userGroupCreated,
    newData: newUserGroup,
  });
};

/**
 * Updates an existing user group by its ID.
 *
 * @function patchUserGroup
 * @param {Request} req - Express request object containing the `id` in params and updated fields in the body.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends:
 *  - 201 JSON indicating successful update.
 *  - 500 Internal Server Error on failure.
 */
export const patchUserGroup = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;
  const updatedUserGroup = await updateUserGroupById(id, req.body);
  res.status(201).json({
    message: APP_RESPONSE_MESSAGE.userUpdated,
    newData: updatedUserGroup,
  });
};

/**
 * Deletes a user group by its ID.
 *
 * @function deleteUserGroup
 * @param {Request} req - Express request object containing the `id` in params.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends:
 *  - 201 JSON indicating successful deletion.
 *  - 500 Internal Server Error on failure.
 */
export const deleteUserGroup = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;
  const deletedUser = await deleteUserGroupById(id);
  res
    .status(201)
    .json({ message: APP_RESPONSE_MESSAGE.userDeleted, newData: deletedUser });
};

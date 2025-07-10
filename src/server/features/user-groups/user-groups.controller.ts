import prisma from "@srvr/utils/db/prisma.ts";
import { Request, Response } from "express";
import {
  createUserGroup,
  deleteManyUserGroupsById,
  deleteUserGroupById,
  updateUserGroupById,
} from "./user-groups.service.ts";
import {
  APP_RESPONSE_MESSAGE,
  HTTP_RESPONSE_CODE,
} from "@srvr/configs/constants.config.ts";
import { Prisma } from "@prisma/client";

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
  const { student, classroom, ids } = req.query;

  const include: Prisma.UserGroupsInclude = {};
  if (student) {
    include.student = {
      include: {
        user: {
          select: {
            name: true,
            username: true,
            email: true,
          },
        },
      },
    };
  }

  if (classroom) {
    include.classrooms = {
      select: {
        id: true,
        classroomName: true,
        course: {
          select: {
            courseName: true,
            courseCode: true,
          },
        },
      },
    };
  }

  // ✅ Parse ids[] properly
  const idArray = Array.isArray(ids)
    ? ids.map(String)
    : ids
      ? [String(ids)]
      : [];

  try {
    const userGroups = await prisma.userGroups.findMany({
      where: {
        ...(idArray.length > 0 ? { id: { in: idArray } } : {}),
      },
      ...(Object.keys(include).length > 0 ? { include } : {}),
    });

    res.status(200).json({
      message: "User groups returned successfully",
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

    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: APP_RESPONSE_MESSAGE.userGroup.userGroupReturned,
      user_groups: userGroup,
    });
  } catch (error) {
    console.error("Error fetching user groups:", error);
    res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ error: "Internal Server Error" });
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
 *  - 400 Bad Request if required fields are missing.
 *  - 409 Conflict if the group already exists.
 *  - 500 Internal Server Error on failure.
 */
export const postUserGroup = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { groupName, classroomId } = req.body;

  if (!classroomId) {
    res
      .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
      .json({ message: "classroomId is required" });
    return;
  }

  if (groupName && groupName.trim() !== "") {
    const userGroupExists = await prisma.userGroups.findUnique({
      where: {
        uniqueGroupPerClassroom: {
          groupName: groupName,
          classroomId: classroomId,
        },
      },
    });

    if (userGroupExists) {
      res
        .status(HTTP_RESPONSE_CODE.CONFLICT)
        .json({ message: APP_RESPONSE_MESSAGE.userGroup.userGroupDoesExist });
      return;
    }
  }
  try {
    const newUserGroup = await createUserGroup(req.body);
    res.status(HTTP_RESPONSE_CODE.CREATED).json({
      message: APP_RESPONSE_MESSAGE.userGroup.userGroupCreated,
      newData: newUserGroup,
    });
  } catch {
    res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ message: APP_RESPONSE_MESSAGE.serverError });
  }
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
  res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
    message: APP_RESPONSE_MESSAGE.userGroup.userGroupUpdated,
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
  const deletedUserGroup = await deleteUserGroupById(id);
  res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
    message: APP_RESPONSE_MESSAGE.userGroup.userGroupDeleted,
    newData: deletedUserGroup,
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
export const deleteManyUserGroup = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const ids = req.body.ids;
  const deletedUserGroups = await deleteManyUserGroupsById(ids);
  res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
    message: APP_RESPONSE_MESSAGE.userGroup.userGroupDeleted,
    newData: deletedUserGroups,
  });
};

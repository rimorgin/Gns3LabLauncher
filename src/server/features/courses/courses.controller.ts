import prisma from "@srvr/utils/db/prisma.ts";
import { Request, Response } from "express";
import {
  createCourse,
  deleteCourseById,
  updateCourseById,
} from "./courses.service.ts";
import { APP_RESPONSE_MESSAGE } from "@srvr/configs/constants.config.ts";
import { prismaErrorCode } from "@srvr/utils/db/helpers.ts";

/**
 * Retrieves a list of all courses.
 *
 * Optionally supports embedding related data if `embed_data` query parameter is provided.
 * Currently, this flag is logged but not yet used to populate related entities.
 *
 * @function getCourses
 *
 * @param {Request} req - Express request object, may contain `embed_data` query parameter.
 * @param {Response} res - Express response object to return course data or errors.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 JSON array of course objects
 *  - 500 Internal Server Error if fetching courses fails
 */
export const getCourses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { only_ids } = req.query;

  const courses = only_ids
    ? await prisma.course.findMany({
        select: { id: true },
      })
    : await prisma.course.findMany();

  res.status(200).json({
    message: APP_RESPONSE_MESSAGE.coursesReturned,
    courses: courses,
  });
};

/**
 * Retrieves a course by id.
 *
 * @function getCourseById
 *
 * @param {Request} req - Express request object, must include `:id` route param.
 * @param {Response} res - Express response object to return course data or errors.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 JSON array of course objects
 *  - 500 Internal Server Error if fetching courses fails
 */
export const getCourseById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id: courseId } = req.params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true },
  });

  res.status(200).json({
    message: APP_RESPONSE_MESSAGE.courseReturned,
    course: course,
  });
};
/**
 * Creates a new course with the given course code and name.
 *
 * If a course with the same `coursecode` already exists, returns a 409 Conflict.
 * On successful creation, invalidates the cached course list in Redis.
 *
 * @function postCourses
 *
 * @param {Request} req - Express request object containing course data in the body.
 * @param {Response} res - Express response object to send success or error messages.
 *
 * @returns {Promise<void>} Sends:
 *  - 201 Created with success message and new course data
 *  - 409 Conflict if course with same coursecode already exists
 *  - 500 Internal Server Error if an exception occurs during creation
 */
export const postCourses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { courseCode } = req.body;

  const isCourseExists = await prisma.course.findUnique({
    where: { courseCode },
  });
  if (isCourseExists) {
    res.status(409).json({ message: APP_RESPONSE_MESSAGE.courseDoesExist });
    return;
  }
  try {
    const newCourse = await createCourse(req.body);
    //console.log("🚀 ~ postCourses ~ courses:", courses)
    res.status(201).json({
      message: APP_RESPONSE_MESSAGE.courseCreated,
      newData: newCourse,
    });
    return;
  } catch (error: unknown) {
    const prismaErr = prismaErrorCode(error);
    if (prismaErr) {
      res.status(prismaErr.status).json({ message: prismaErr.message });
      return;
    }
  }

  res.status(500).json({ message: APP_RESPONSE_MESSAGE.serverError });
};

/**
 * Updates an existing course by ID using the service method.
 *
 * @function patchCourse
 *
 * @param {Request} req - Express request object containing `id` in the URL and update fields in the body.
 * @param {Response} res - Express response object to return success or error messages.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 JSON with updated course data
 *  - 404 Not Found if course does not exist
 *  - 500 Internal Server Error if update fails
 */
export const patchCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const updatedCourse = await updateCourseById(id, req.body);

    if (!updatedCourse) {
      res.status(404).json({ message: APP_RESPONSE_MESSAGE.courseDoesntExist });
      return;
    }

    res.status(200).json({
      message: APP_RESPONSE_MESSAGE.courseUpdated,
      newData: updatedCourse,
    });
  } catch (error: unknown) {
    const prismaErr = prismaErrorCode(error);
    if (prismaErr) {
      res.status(prismaErr.status).json({ message: prismaErr.message });
      return;
    }
  }

  res.status(500).json({ message: APP_RESPONSE_MESSAGE.serverError });
};

/**
 * Deletes an existing course by ID using the service method.
 *
 * @function deleteCourse
 *
 * @param {Request} req - Express request object containing `id` in the URL.
 * @param {Response} res - Express response object to return success or error messages.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 JSON with deleted course data
 *  - 404 Not Found if course does not exist
 *  - 500 Internal Server Error if deletion fails
 */
export const deleteCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const deleted = await deleteCourseById(id);

    if (!deleted) {
      res.status(404).json({ message: APP_RESPONSE_MESSAGE.courseDoesntExist });
      return;
    }

    res.status(200).json({
      message: APP_RESPONSE_MESSAGE.courseDeleted,
      newData: deleted,
    });
  } catch (error: unknown) {
    const prismaErr = prismaErrorCode(error);
    if (prismaErr) {
      res.status(prismaErr.status).json({ message: prismaErr.message });
      return;
    }
  }

  res.status(500).json({ message: APP_RESPONSE_MESSAGE.serverError });
};

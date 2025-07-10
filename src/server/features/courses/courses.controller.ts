import prisma from "@srvr/utils/db/prisma.ts";
import { Request, Response } from "express";
import {
  createCourse,
  deleteCourseById,
  deleteManyCoursesById,
  updateCourseById,
} from "./courses.service.ts";
import {
  APP_RESPONSE_MESSAGE,
  HTTP_RESPONSE_CODE,
} from "@srvr/configs/constants.config.ts";

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
  const { classrooms, only_ids } = req.query;

  const isClassroomIncluded = classrooms ? true : false;

  const courses = only_ids
    ? await prisma.course.findMany({
        select: {
          id: true,
          classrooms: isClassroomIncluded
            ? { select: { id: true, classroomName: true, status: true } }
            : false,
        },
      })
    : await prisma.course.findMany({
        include: {
          classrooms: isClassroomIncluded
            ? { select: { id: true, classroomName: true, status: true } }
            : false,
        },
      });

  res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
    message: APP_RESPONSE_MESSAGE.course.coursesReturned,
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

  res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
    message: APP_RESPONSE_MESSAGE.course.courseReturned,
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
    res
      .status(HTTP_RESPONSE_CODE.CONFLICT)
      .json({ message: APP_RESPONSE_MESSAGE.course.courseDoesExist });
    return;
  }
  try {
    const newCourse = await createCourse(req.body);
    //console.log("🚀 ~ postCourses ~ courses:", courses)
    res.status(HTTP_RESPONSE_CODE.CREATED).json({
      message: APP_RESPONSE_MESSAGE.course.courseCreated,
      newData: newCourse,
    });
    return;
  } catch {
    res.status(HTTP_RESPONSE_CODE.SERVER_ERROR).json({
      message: APP_RESPONSE_MESSAGE.serverError,
    });
    return;
  }
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
      res
        .status(HTTP_RESPONSE_CODE.NOT_FOUND)
        .json({ message: APP_RESPONSE_MESSAGE.course.courseDoesntExist });
      return;
    }

    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: APP_RESPONSE_MESSAGE.course.courseUpdated,
      newData: updatedCourse,
    });
  } catch {
    res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ message: APP_RESPONSE_MESSAGE.serverError });
    return;
  }
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
      res
        .status(HTTP_RESPONSE_CODE.NOT_FOUND)
        .json({ message: APP_RESPONSE_MESSAGE.course.courseDoesntExist });
      return;
    }

    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: APP_RESPONSE_MESSAGE.course.courseDeleted,
      newData: deleted,
    });
  } catch {
    res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ message: APP_RESPONSE_MESSAGE.serverError });
    return;
  }
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
export const deleteManyCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const ids = req.body.ids;

  try {
    const deleted = await deleteManyCoursesById(ids);

    if (!deleted) {
      res
        .status(HTTP_RESPONSE_CODE.NOT_FOUND)
        .json({ message: APP_RESPONSE_MESSAGE.course.courseDoesntExist });
      return;
    }

    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: APP_RESPONSE_MESSAGE.course.courseDeleted,
      newData: deleted,
    });
  } catch {
    res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ message: APP_RESPONSE_MESSAGE.serverError });
    return;
  }
};

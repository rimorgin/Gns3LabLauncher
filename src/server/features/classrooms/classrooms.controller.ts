import prisma from "@srvr/utils/db/prisma.ts";
import {
  createClassroom,
  deleteClassroomById,
  updateClassroomById,
} from "./classrooms.service.ts";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import {
  APP_RESPONSE_MESSAGE,
  HTTP_RESPONSE_CODE,
} from "@srvr/configs/constants.config.ts";

/**
 * Retrieves a list of classrooms.
 *
 * Optionally populates related course data if `embed_data` query parameter is present.
 *
 * @function getClassrooms
 *
 * @param {Request} req - Express request object, may contain `embed_data` query parameter.
 * @param {Response} res - Express response object to return classroom data or errors.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 JSON array of classroom objects (with optionally populated course info)
 *  - 500 Internal Server Error if fetching classrooms fails
 */
export const getClassrooms = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { course, courseId, students, instructor, projects, only_ids } =
    req.query;

  // Convert query params to booleans
  const isCourse = course === "true";
  const isCourseId = courseId === "true";
  const isStudents = students === "true";
  const isInstructor = instructor === "true";
  const isProjects = projects === "true";
  const isOnlyIds = only_ids === "true";

  const includeOptions: Prisma.ClassroomSelect | undefined = {
    course: isCourse,
    courseId: isCourseId,
    students: isStudents
      ? {
          select: {
            user: {
              select: {
                name: true,
                email: true,
                username: true,
              },
            },
          },
        }
      : false,
    instructor: isInstructor
      ? {
          select: {
            user: {
              select: {
                name: true,
                email: true,
                username: true,
              },
            },
          },
        }
      : false,
    projects: isProjects,
  };
  const classrooms = isOnlyIds
    ? await prisma.classroom.findMany({
        select: {
          id: true,
          ...includeOptions,
        },
      })
    : await prisma.classroom.findMany({
        select: {
          id: true,
          classroomName: true,
          status: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
          ...includeOptions,
        },
      });

  //console.log("🚀 ~ getClassrooms ~ classrooms:", classrooms);
  res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
    message: APP_RESPONSE_MESSAGE.classroom.classroomsReturned,
    classrooms: classrooms,
  });
};

/**
 * Retrieves a classroom by id.
 *
 *
 * * Query Parameters:
 *  - course: If present, includes related course details.
 *  - students: If present, includes related students details.
 *  - instructor: If present, includes related instructor details.
 *  - projects: If present, includes related projects details.
 *
 * @function getClassroomById
 *
 * @param {Request} req - Express request object, may contain request :id as parameter and query parameters.
 * @param {Response} res - Express response object to return classroom data or errors.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 JSON array of classroom objects (with optionally populated course info)
 *  - 500 Internal Server Error if fetching classrooms fails
 */
export const getClassroomById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id: classroomID } = req.params;
  const { course, courseId, students, instructor, projects } = req.query;
  console.log("🚀 ~ courseId:", courseId);

  const includeOptions: Prisma.ClassroomSelect | undefined = {
    course: course ? true : false,
    courseId: courseId ? true : false,
    students: students ? true : false,
    instructor: instructor ? true : false,
    projects: projects ? true : false,
  };
  const classrooms = await prisma.classroom.findUnique({
    where: { id: classroomID },
    select: {
      id: true,
      classroomName: true,
      status: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      ...includeOptions,
    },
  });

  //console.log("🚀 ~ getClassrooms ~ classrooms:", classrooms);
  res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
    message: APP_RESPONSE_MESSAGE.classroom.classroomsReturned,
    classrooms: classrooms,
  });
};

/**
 * Creates a new classroom with the given details after checking for duplicates.
 *
 * A classroom is considered a duplicate if a record already exists
 * with the same `courseId` and `classroomName`.
 *
 * On successful creation, invalidates the cached classroom list in Redis.
 *
 * @function postClassroom
 *
 * @param {Request} req - Express request object containing classroom data in the body.
 * @param {Response} res - Express response object to send success or error messages.
 *
 * @returns {Promise<void>} Sends:
 *  - 201 Created with success message and new classroom data
 *  - 409 Conflict if classroom with same name and course ID already exists
 *  - 500 Internal Server Error if an exception occurs during creation
 */
export const postClassroom = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { courseId, classroomName } = req.body;

  const isClassroomExists = await prisma.classroom.findUnique({
    where: {
      uniqueClassroomPerCourse: {
        classroomName: classroomName,
        courseId: courseId,
      },
    },
  });
  if (isClassroomExists) {
    res
      .status(HTTP_RESPONSE_CODE.CONFLICT)
      .json({ message: APP_RESPONSE_MESSAGE.classroom.classroomDoesExist });
    return;
  }
  try {
    const newClassroom = await createClassroom(req.body);
    //console.log("🚀 ~ postCourses ~ courses:", courses)
    res.status(HTTP_RESPONSE_CODE.CREATED).json({
      message: APP_RESPONSE_MESSAGE.classroom.classroomCreated,
      newData: newClassroom,
    });
  } catch {
    res.status(HTTP_RESPONSE_CODE.SERVER_ERROR).json({
      message: APP_RESPONSE_MESSAGE.serverError,
    });
  }
  return;
};

/**
 * Updates an existing classroom by ID using service method.
 *
 * @function patchClassroom
 *
 * @param {Request} req - Express request object containing `id` in the URL and update fields in the body.
 * @param {Response} res - Express response object to return success or error messages.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 JSON with updated classroom data
 *  - 404 Not Found if classroom does not exist
 *  - 500 Internal Server Error if update fails
 */
export const patchClassroom = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const updatedClassroom = await updateClassroomById(id, req.body);

    if (!updatedClassroom) {
      res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({
        message: APP_RESPONSE_MESSAGE.classroom.classroomDoesntExist,
      });
      return;
    }

    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: APP_RESPONSE_MESSAGE.classroom.classroomUpdated,
      newData: updatedClassroom,
    });
  } catch {
    res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ message: APP_RESPONSE_MESSAGE.serverError });
    return;
  }
};

/**
 * Deletes an existing classroom by ID using service method.
 *
 * @function deleteClassroom
 *
 * @param {Request} req - Express request object containing `id` in the URL.
 * @param {Response} res - Express response object to return success or error messages.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 JSON with deleted classroom data
 *  - 404 Not Found if classroom does not exist
 *  - 500 Internal Server Error if deletion fails
 */
export const deleteClassroom = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedClassroom = await deleteClassroomById(id);

    if (!deletedClassroom) {
      res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({
        message: APP_RESPONSE_MESSAGE.classroom.classroomDoesntExist,
      });
      return;
    }

    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: APP_RESPONSE_MESSAGE.classroom.classroomDeleted,
      newData: deletedClassroom,
    });
  } catch {
    res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ message: APP_RESPONSE_MESSAGE.serverError });
    return;
  }
};

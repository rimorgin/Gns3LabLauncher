import prisma from "@srvr/utils/db/prisma.ts";
import { Request, Response } from "express";
import { createCourse } from "./courses.service.ts";

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
        select: { id: true }
      })
    : await prisma.course.findMany();
  

  res.status(200).json(courses);
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
  console.log("posting course for user: ", req.user?.username);
  const { courseCode } = req.body;

  const isCourseExists = await prisma.course.findUnique({ where: { courseCode }})
  if (isCourseExists) {
    res.status(409).json({ message: "Course already exists." });
    return
  }
  try {
    const newCourse = await createCourse(req.body)
    //console.log("🚀 ~ postCourses ~ courses:", courses)
    res.status(201).json({ message: "Course created", newData: newCourse });
    return;
  } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error creating course: ${error.message}` });
  }
};
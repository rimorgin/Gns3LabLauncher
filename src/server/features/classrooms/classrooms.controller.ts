import prisma from "@srvr/utils/db/prisma.ts";
import { createClassroom } from "./classrooms.service.ts";
import { Request, Response } from "express";

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
  const {embed_data: requiresEmbeddedData, course, students, instructor, projects, only_ids, partial } = req.query;

  const classrooms = requiresEmbeddedData
    ? await prisma.classroom.findMany({
        include: {
          course: course ? true : false,
          students: students ? true : false,
          instructor: instructor ? true : false,
          projects: projects ? true : false
        }
      })
    : only_ids 
    ? await prisma.classroom.findMany({
        select: {
          id: true
        }
      }) 
    : partial 
    ? await prisma.classroom.findMany({
        select: {
          id: true,
          classroomName: true,
        }
      }) 
    : await prisma.course.findMany();

  //console.log("🚀 ~ getClassrooms ~ classrooms:", classrooms);
  res.status(200).json(classrooms);
};

/**
 * Creates a new classroom with the given details after checking for duplicates.
 *
 * A classroom is considered a duplicate if a record already exists
 * with the same `courseid` and `classname`.
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
        courseId: courseId
      }
    }
  })
  if (isClassroomExists) {
    res.status(409).json({ message: "Classroom already exists." });
    return;
  }
  try {
    const newClassroom = await createClassroom(req.body)
    //console.log("🚀 ~ postCourses ~ courses:", courses)
    res
      .status(201)
      .json({ message: "Classroom created", newData: newClassroom });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating Classroom: ${error.message}` });
  }
};
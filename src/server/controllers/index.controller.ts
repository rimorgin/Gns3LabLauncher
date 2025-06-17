/**
 * @fileoverview Controller module for handling user permissions and protected route access.
 *
 * This module includes controllers to:
 * - Retrieve current user's permissions based on their role
 * - Render or respond to protected routes (e.g., dashboard)
 *
 * @module permissions.controller
 */

import { UserRolesEnum } from "@prisma/client";
import roles from "@srvr/configs/roles.config.ts";
import { redisClient } from "@srvr/database/redis.database.ts";
import prisma from "@srvr/utils/db/prisma.ts";
import { getRolePermissions } from "@srvr/utils/db/helpers.ts";
import { Request, Response } from "express";
import { createUser } from "@srvr/utils/db/crud/user.crud.ts";
import { createCourse } from "@srvr/utils/db/crud/course.crud.ts";
import { createClassroom } from "@srvr/utils/db/crud/classroom.crud.ts";
import { createProject } from "@srvr/utils/db/crud/project.crud.ts";

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
 * Handler for the root protected route (`GET /`).
 *
 * Used to verify that authentication and session are working correctly.
 *
 * @function getIndex
 *
 * @param {Request} req - Express request object containing session and user data.
 * @param {Response} res - Express response object to reply with simple authorization confirmation.
 *
 * @returns {void} Sends a simple JSON response confirming authorization.
 */
export const getIndex = (req: Request, res: Response): void => {
  console.log(req.user);
  res.json("authorize");
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
    redisClient.del("gns3labroutes:cache:/api/v1/courses");
    return;
  } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error creating course: ${error.message}` });
  }
};

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
    redisClient.del("gns3labroutes:cache:/api/v1/classrooms");
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating Classroom: ${error.message}` });
  }
};

/**
 * Retrieves a list of projects, optionally populated with embedded classroom data.
 *
 * If `embed_data` query parameter is present, it populates related classroom details.
 *
 * @function getProjects
 *
 * @param {Request} req - Express request object, may include `embed_data` query param.
 * @param {Response} res - Express response object to return project data or errors.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 JSON array of projects
 *  - 500 Internal Server Error if fetching fails
 */
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  const { embed_data: requiresEmbeddedData, only_ids, partial } = req.query;
  const projects = requiresEmbeddedData
    ? await prisma.project.findMany({
        include: {
          classroom: true
        },
    })
    : only_ids 
    ? await prisma.project.findMany({
        select: {
          id: true
        }
      })
    : partial 
    ? await prisma.project.findMany({
        select: {
          id: true,
          projectName: true,
        }
      }) 
    : await prisma.project.findMany();
  
  res.status(200).json(projects)
}

/**
 * Creates a new project after checking for uniqueness by name.
 *
 * @function postProjects
 *
 * @param {Request} req - Express request object containing project data in the body.
 * @param {Response} res - Express response object to return success or error messages.
 *
 * @returns {Promise<void>} Sends:
 *  - 201 Created with the new project data
 *  - 409 Conflict if a project with the same name already exists
 *  - 500 Internal Server Error if an exception occurs
 */
export const postProjects = async (req: Request, res: Response): Promise<void> => {
  const { projectName } = req.body;
  const projectExists = await prisma.project.findUnique({ where: { projectName } });
  console.log("🚀 ~ postProjects ~ projectName :", projectName )

  if (projectExists) {
    res.status(409).json({ message: "Project already exists." });
    return;
  }

  try {
    const newProject = await createProject(req.body)
    res.status(201).json({ message: "Project created", newData: newProject });
    redisClient.del("gns3labroutes:cache:/api/v1/projects");
  } catch (error: any) {
    res.status(500).json({ message: `Error creating Project: ${error.message}` });
  }
};
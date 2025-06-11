/**
 * @fileoverview Controller module for handling user permissions and protected route access.
 *
 * This module includes controllers to:
 * - Retrieve current user's permissions based on their role
 * - Render or respond to protected routes (e.g., dashboard)
 *
 * @module permissions.controller
 */

import roles from "@srvr/configs/roles.config.ts";
import { redisClient } from "@srvr/database/redis.database.ts";
import Classroom from "@srvr/models/classroom.model.ts";
import Course from "@srvr/models/course.model.ts";
import Projects from "@srvr/models/projects.model.ts";
import User from "@srvr/models/user.model.ts";
import { createClassroom, createCourse, createProject, createUser } from "@srvr/utils/db-helpers.utils.ts";
import { getRolePermissions } from "@srvr/utils/user-helpers.utils.ts";
import { Request, Response } from "express";

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
  const role = req.query.role as string;
  console.log("🚀 ~ getUsers ~ role :", role )
  const filter: Record<string, any> = {
    role: role ? role : { $ne: "administrator" }, // always exclude admin
  };
  // If role is specified, override role filter to exact match
  if (role) {
    filter.role = role;
  } else {
    filter.role = { $ne: "administrator" };
  }
  const users = await User.find(filter).exec();
  res.status(200).json(users);
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
  console.log("🚀 ~ postUsers ~ req.body:", req.body)
  const { username, email } = req.body
  const isUserExists = await User.findOne({
    $or: [{ username }, { email }]
  }).exec();

  if (isUserExists) {
    res.status(409).json({ message: "User already exists." });
    return
  }

  const newUser = await createUser(req.body)
  res.status(200).json({message: "User Created", newData: newUser})
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
  const requiresEmbeddedData = req.query.embed_data;
  console.log("boolean embed", requiresEmbeddedData);

  const courses = await Course.find().exec();
  //console.log("🚀 ~ getCourses ~ courses:", courses)
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
  const { coursecode } = req.body;

  const isCourseExists = await Course.findOne({coursecode})
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
  const requiresEmbeddedData = req.query.embed_data;

  const classrooms = requiresEmbeddedData
    ? await Classroom.find().populate("courseid").exec()
    : await Classroom.find().exec();

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
  const { courseid, classname } = req.body;

  const isClassroomExists = await Classroom.findOne({
    courseid,
    classname,
  }).exec();
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
  const requiresEmbeddedData = req.query.embed_data;
  const projects = requiresEmbeddedData
    ? await Classroom.find().populate("classroom").exec()
    : await Classroom.find().exec();
  
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
  const { projectname } = req.body;
  const projectExists = await Projects.findOne({projectname}).exec();

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
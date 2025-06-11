import { Router } from "express";
import {
  getClassrooms,
  getCourses,
  getIndex,
  getProjects,
  getUserPermissions,
  getUsers,
  postClassroom,
  postCourses,
  postProjects,
  postUsers,
} from "@srvr/controllers/index.controller.ts";
import {
  checkAuthentication,
  checkPermission,
} from "@srvr/middlewares/auth.middleware.ts";
import {
  redisCache,
} from "@srvr/middlewares/redis-cache.middleware.ts";
import {
  mongoWebGuiProxyInstance,
} from "@srvr/middlewares/http-proxy.middleware.ts";

const router: Router = Router();

/**
 * @route   GET /
 * @desc    Protected root route - confirms user access to the main application.
 * @access  Authenticated users with 'read_dashboard' permission
 */
router.get(
  "/",
  checkAuthentication,
  checkPermission(["read_dashboard"]),
  getIndex
);

/**
 * @route   GET /permissions
 * @desc    Get current authenticated user's permissions based on their role.
 * @access  Authenticated users
 */
router.get(
  "/permissions",
  checkAuthentication,
  redisCache({ withUserId: true }),
  getUserPermissions
);

/**
 * @route   GET /users
 * @desc    Fetch list of users filtered by optional query parameter `role`.
 * @access  Authenticated users with 'read_users' permission
 */
router.get(
  "/users",
  checkAuthentication,
  checkPermission(["read_users"]),
  getUsers
);

/**
 * @route   POST /users
 * @desc    Create a new user.
 * @access  Authenticated users with 'create_users' permission
 */
router.post(
  "/users",
  checkAuthentication,
  checkPermission(["create_users"]),
  postUsers
);

/**
 * @route   GET /courses
 * @desc    Fetch list of all courses, optionally with embedded data.
 * @access  Authenticated users with 'read_courses' permission
 */
router.get(
  "/courses",
  checkAuthentication,
  checkPermission(["read_courses"]),
  getCourses
);

/**
 * @route   POST /courses
 * @desc    Create a new course.
 * @access  Authenticated users with 'create_courses' permission
 */
router.post(
  "/courses",
  checkAuthentication,
  checkPermission(["create_courses"]),
  postCourses
);

/**
 * @route   GET /classrooms
 * @desc    Fetch list of all classrooms, optionally populated with course details.
 * @access  Authenticated users with 'read_classrooms' permission
 */
router.get(
  "/classrooms",
  checkAuthentication,
  checkPermission(["read_classrooms"]),
  getClassrooms
);

/**
 * @route   POST /classrooms
 * @desc    Create a new classroom.
 * @access  Authenticated users with 'create_classrooms' permission
 */
router.post(
  "/classrooms",
  checkAuthentication,
  checkPermission(["create_classrooms"]),
  postClassroom
);

/**
 * @route   GET /projects
 * @desc    Fetch list of all projects, optionally populated with classroom info.
 * @access  Authenticated users with 'read_projects' permission
 */
router.get(
  "/projects",
  checkAuthentication,
  checkPermission(["read_projects"]),
  getProjects
);

/**
 * @route   POST /projects
 * @desc    Create a new project.
 * @access  Authenticated users with 'create_projects' permission
 */
router.post(
  "/projects",
  checkAuthentication,
  checkPermission(["create_projects"]),
  postProjects
);

/**
 * @route   Proxy /proxy/mongo-gui
 * @desc    Reverse proxy to MongoDB Web GUI via HTTP proxy middleware.
 * @access  Authenticated users (controlled in proxy middleware)
 */
router.use("/proxy/mongo-gui", mongoWebGuiProxyInstance);

export default router;
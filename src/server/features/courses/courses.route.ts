import {
  checkAuthentication,
  checkPermission,
} from "@srvr/middlewares/auth.middleware.ts";
import { Router } from "express";
import {
  deleteCourse,
  deleteManyCourse,
  getCourseById,
  getCourses,
  patchCourse,
  postCourses,
} from "./courses.controller.ts";

const router = Router();

/**
 * @route   GET /courses
 * @desc    Fetch list of all courses, optionally with embedded data.
 * @access  Authenticated users with 'read_courses' permission
 */
router.get(
  "/",
  checkAuthentication,
  checkPermission(["read_courses"]),
  getCourses,
);

/**
 * @route   GET /courses/:id
 * @desc    Fetch a course by id
 * @access  Authenticated users with 'read_courses' permission
 */
router.get(
  "/:id",
  checkAuthentication,
  checkPermission(["read_courses"]),
  getCourseById,
);

/**
 * @route   POST /courses
 * @desc    Create a new course.
 * @access  Authenticated users with 'create_courses' permission
 */
router.post(
  "/",
  checkAuthentication,
  checkPermission(["create_courses"]),
  postCourses,
);

/**
 * @route   PATCH /courses/:id
 * @desc    Updates a course.
 * @access  Authenticated users with 'update_courses' permission
 */
router.patch(
  "/:id",
  checkAuthentication,
  checkPermission(["create_courses"]),
  patchCourse,
);

/**
 * @route   DELETE /courses/many
 * @desc    Deletes a course.
 * @access  Authenticated users with 'delete_courses' permission
 */
router.delete(
  "/many",
  checkAuthentication,
  checkPermission(["delete_courses"]),
  deleteManyCourse,
);

/**
 * @route   DELETE /courses/:id
 * @desc    Deletes a course.
 * @access  Authenticated users with 'delete_courses' permission
 */
router.delete(
  "/:id",
  checkAuthentication,
  checkPermission(["delete_courses"]),
  deleteCourse,
);

export default router;

import { checkAuthentication, checkPermission } from "@srvr/middlewares/auth.middleware.ts";
import { Router } from "express";
import { getCourses, postCourses } from "./courses.controller.ts";

const router = Router()

/**
 * @route   GET /courses
 * @desc    Fetch list of all courses, optionally with embedded data.
 * @access  Authenticated users with 'read_courses' permission
 */
router.get(
  "/",
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
  "/",
  checkAuthentication,
  checkPermission(["create_courses"]),
  postCourses
);

export default router;
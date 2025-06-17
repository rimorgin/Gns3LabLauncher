import { checkAuthentication, checkPermission } from "@srvr/middlewares/auth.middleware.ts";
import { Router } from "express";
import { getClassrooms, postClassroom } from "./classrooms.controller.ts";

const router = Router()

/**
 * @route   GET /classrooms
 * @desc    Fetch list of all classrooms, optionally populated with course details.
 * @access  Authenticated users with 'read_classrooms' permission
 */
router.get(
  "/",
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
  "/",
  checkAuthentication,
  checkPermission(["create_classrooms"]),
  postClassroom
)

export default router;
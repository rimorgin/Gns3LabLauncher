import {
  checkAuthentication,
  checkPermission,
} from "@srvr/middlewares/auth.middleware.ts";
import { Router } from "express";
import {
  deleteClassroom,
  deleteClassroomMany,
  getClassrooms,
  patchClassroom,
  postClassroom,
} from "./classrooms.controller.ts";

const router = Router();

/**
 * @route   GET /classrooms
 * @desc    Fetch list of all classrooms, optionally populated with course details.
 * @access  Authenticated users with 'read_classrooms' permission
 */
router.get(
  "/",
  checkAuthentication,
  checkPermission(["read_classrooms"]),
  getClassrooms,
);

/**
 * @route   GET /classroomById
 * @desc    Fetch a classroom by id,
 * @access  Authenticated users with 'read_classrooms' permission
 */
/* router.get(
  "/:id",
  checkAuthentication,
  checkPermission(["read_classrooms"]),
  getClassroomById,
); */

/**
 * @route   POST /classrooms
 * @desc    Create a new classroom.
 * @access  Authenticated users with 'create_classrooms' permission
 */
router.post(
  "/",
  checkAuthentication,
  checkPermission(["create_classrooms"]),
  postClassroom,
);

/**
 * @route   PATCH /classrooms/:id
 * @desc    Updates classroom.
 * @access  Authenticated users with 'update_classrooms' permission
 */
router.patch(
  "/:id",
  checkAuthentication,
  checkPermission(["update_classrooms"]),
  patchClassroom,
);

/**
 * @route   DELETE /classrooms/many
 * @desc    Delete a resources in classrooms.
 * @access  Authenticated users with 'delete_classrooms' permission
 */
router.delete(
  "/many",
  checkAuthentication,
  checkPermission(["delete_users"]),
  deleteClassroomMany,
);

/**
 * @route   DELETE /classrooms/:id
 * @desc    Deletes classroom.
 * @access  Authenticated users with 'deletes_classrooms' permission
 */
router.delete(
  "/:id",
  checkAuthentication,
  checkPermission(["delete_classrooms"]),
  deleteClassroom,
);

export default router;

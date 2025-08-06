import {
  checkAuthentication,
  checkPermission,
} from "@srvr/middlewares/auth.middleware.ts";
import { Router } from "express";
import {
  bulkPostUsers,
  deleteUser,
  deleteUsersMany,
  getUserById,
  getUsers,
  patchUser,
  postUsers,
} from "./users.controller.ts";
import { validateData } from "@srvr/middlewares/validation.middleware.ts";
import {
  userCreateSchema,
  userBulkCreateSchema,
  userUpdateSchema,
} from "@srvr/utils/validators/user-schema.ts";

const router = Router();

/**
 * @route   GET /users
 * @desc    Fetch list of users filtered by optional query parameter `role`.
 * @access  Authenticated users with 'read_users' permission
 */
router.get("/", checkAuthentication, checkPermission(["read_users"]), getUsers);

/**
 * @route   GET /users/:id
 * @desc    Fetch list of users filtered by optional query parameter `role`.
 * @access  Authenticated users with 'read_users' permission
 */
router.get(
  "/:id",
  checkAuthentication,
  checkPermission(["read_users"]),
  getUserById,
);

/**
 * @route   POST /users
 * @desc    Create a new user.
 * @access  Authenticated users with 'create_users' permission
 */
router.post(
  "/",
  validateData(userCreateSchema),
  checkAuthentication,
  checkPermission(["create_users"]),
  postUsers,
);

/**
 * @route POST /users/bulk
 * @desc Create multiple users in one request
 * @access  Authenticated users with 'create_users' permission
 */
router.post(
  "/bulk",
  validateData(userBulkCreateSchema),
  checkAuthentication,
  checkPermission(["create_users"]),
  bulkPostUsers,
);

/**
 * @route   PATCH /users/:id
 * @desc    Update a resource in user.
 * @access  Authenticated users with 'update_users' permission
 */
router.patch(
  "/:id",
  validateData(userUpdateSchema),
  checkAuthentication,
  checkPermission(["update_users"]),
  patchUser,
);

/**
 * @route   DELETE /users/many
 * @desc    Delete a resources in user.
 * @access  Authenticated users with 'delete_users' permission
 */
router.delete(
  "/many",
  checkAuthentication,
  checkPermission(["delete_users"]),
  deleteUsersMany,
);

/**
 * @route   DELETE /users/:id
 * @desc    Delete a resource in user.
 * @access  Authenticated users with 'delete_users' permission
 */
router.delete(
  "/:id",
  checkAuthentication,
  checkPermission(["delete_users"]),
  deleteUser,
);

export default router;

import { checkAuthentication, checkPermission } from "@srvr/middlewares/auth.middleware.ts";
import { Router } from "express";
import { deleteUser, getUsers, patchUser, postUsers } from "./users.controller.ts";

const router = Router()

/**
 * @route   GET /users
 * @desc    Fetch list of users filtered by optional query parameter `role`.
 * @access  Authenticated users with 'read_users' permission
 */
router.get(
  "/",
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
  "/",
  checkAuthentication,
  checkPermission(["create_users"]),
  postUsers
);

/**
 * @route   PATCH /users/:id
 * @desc    Update a resource in user.
 * @access  Authenticated users with 'update_users' permission
 */
router.patch(
  "/:id",
  checkAuthentication,
  checkPermission(["update_users"]),
  patchUser
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
  deleteUser
);

export default router;
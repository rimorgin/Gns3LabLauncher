import {
  checkAuthentication,
  checkPermission,
} from "@srvr/middlewares/auth.middleware.ts";
import { Router } from "express";
import {
  deleteManyUserGroup,
  deleteUserGroup,
  getUserGroupById,
  getUserGroups,
  patchUserGroup,
  postUserGroup,
} from "./user-groups.controller.ts";
import {
  userGroupCreateSchema,
  userGroupUpdateSchema,
} from "@srvr/utils/validators/user-group-schema.ts";
import { validateData } from "@srvr/middlewares/validation.middleware.ts";

const router = Router();

/**
 * @route   GET /user-groups
 * @desc    Fetch list of user groups
 * @access  Authenticated users with 'read_user-groups' permission
 */
router.get(
  "/",
  checkAuthentication,
  checkPermission(["read_user-groups"]),
  getUserGroups,
);

/**
 * @route   GET /user-groups
 * @desc    Fetch list of user groups
 * @access  Authenticated users with 'read_user-groups' permission
 */
router.get(
  "/:id",
  checkAuthentication,
  checkPermission(["read_user-groups"]),
  getUserGroupById,
);

/**
 * @route   POST /user-group
 * @desc    Create a new user group.
 * @access  Authenticated users with 'create_user-groups' permission
 */
router.post(
  "/",
  validateData(userGroupCreateSchema),
  checkAuthentication,
  checkPermission(["create_user-groups"]),
  postUserGroup,
);

/**
 * @route   PATCH /user-group/:id
 * @desc    Update a resource in user.
 * @access  Authenticated users with 'update_user-group' permission
 */
router.patch(
  "/:id",
  validateData(userGroupUpdateSchema),
  checkAuthentication,
  checkPermission(["update_user-groups"]),
  patchUserGroup,
);

/**
 * @route   DELETE /user-group/many
 * @desc    Deletes many resource in usergroup.
 * @access  Authenticated users with 'delete_user-group' permission
 */
router.delete(
  "/many",
  checkAuthentication,
  checkPermission(["delete_users"]),
  deleteManyUserGroup,
);
/**
 * @route   DELETE /user-group/:id
 * @desc    Delete a resource in user.
 * @access  Authenticated users with 'delete_user-group' permission
 */
router.delete(
  "/:id",
  checkAuthentication,
  checkPermission(["delete_users"]),
  deleteUserGroup,
);

export default router;

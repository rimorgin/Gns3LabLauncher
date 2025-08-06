import {
  checkAuthentication,
  checkPermission,
} from "@srvr/middlewares/auth.middleware.ts";
import { Router } from "express";
import {
  deleteManyProjects,
  deleteProject,
  getProjects,
  getProjectsById,
  patchProject,
  postProjects,
} from "./projects.controller.ts";
import { validateData } from "@srvr/middlewares/validation.middleware.ts";
import {
  projectCreateSchema,
  projectUpdateSchema,
} from "@srvr/utils/validators/projects-schema.ts";

const router = Router();

/**
 * @route   GET /projects
 * @desc    Fetch list of all projects, optionally populated with classroom info.
 * @access  Authenticated users with 'read_projects' permission
 */
router.get(
  "/",
  checkAuthentication,
  checkPermission(["read_projects"]),
  getProjects,
);

/**
 * @route   GET /projects/:id
 * @desc    Fetch list of all projects, optionally populated with classroom info.
 * @access  Authenticated users with 'read_projects' permission
 */
router.get(
  "/:id",
  checkAuthentication,
  checkPermission(["read_projects"]),
  getProjectsById,
);

/**
 * @route   POST /projects
 * @desc    Create a new project.
 * @access  Authenticated users with 'create_projects' permission
 */
router.post(
  "/",
  validateData(projectCreateSchema),
  checkAuthentication,
  checkPermission(["create_projects"]),
  postProjects,
);

/**
 * @route   PATCH /projects/:id
 * @desc    Updates a project.
 * @access  Authenticated users with 'update_projects' permission
 */
router.patch(
  "/:id",
  validateData(projectUpdateSchema),
  checkAuthentication,
  checkPermission(["read_projects"]),
  patchProject,
);

/**
 * @route   DELETE /projects/many
 * @desc    Deletes many project.
 * @access  Authenticated users with 'delete_projects' permission
 */
router.delete(
  "/many",
  checkAuthentication,
  checkPermission(["read_projects"]),
  deleteManyProjects,
);

/**
 * @route   DELETE /projects/:id
 * @desc    Delete a project.
 * @access  Authenticated users with 'delete_projects' permission
 */
router.delete(
  "/:id",
  checkAuthentication,
  checkPermission(["read_projects"]),
  deleteProject,
);

export default router;

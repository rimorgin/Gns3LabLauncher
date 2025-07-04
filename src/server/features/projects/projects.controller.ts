import prisma from "@srvr/utils/db/prisma.ts";
import { Request, Response } from "express";
import {
  createProject,
  deleteProjectById,
  updateProjectById,
} from "./projects.service.ts";
import { APP_RESPONSE_MESSAGE } from "@srvr/configs/constants.config.ts";

/**
 * Retrieves a list of projects, optionally including classroom data or selecting specific fields.
 *
 * If query parameters is present, it populates related (relations) classroom details.
 *
 * Query Parameters:
 *  - classroom: If present, includes related classroom details.
 *  - only_ids: If present, returns only project IDs.
 *  - partial: If present, returns project IDs and names.
 *
 * @function getProjects
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends:
 *  - 200 JSON array of projects
 *  - 500 Internal Server Error if fetching fails
 */
export const getProjects = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { classroom, only_ids, partial } = req.query;
  const projects = classroom
    ? await prisma.project.findMany({
        include: {
          classroom: true,
        },
      })
    : only_ids
      ? await prisma.project.findMany({
          select: {
            id: true,
          },
        })
      : partial
        ? await prisma.project.findMany({
            select: {
              id: true,
              projectName: true,
            },
          })
        : await prisma.project.findMany();

  res.status(200).json({
    message: APP_RESPONSE_MESSAGE.project.projectsReturned,
    projects: projects,
  });
};

/**
 * Retrieves a project by id, optionally populated with embedded classroom data.
 *
 * If query parameters is present, it populates related (relations) classroom details.
 *
 *  * Query Parameters:
 *  - classroom: If present, includes related classroom details.
 *  - partial: If present, returns project ID and name only.
 *
 * @function getProjectsById
 *
 * @param {Request} req - Express request object, must include `:id` route param and may include query params.
 * @param {Response} res - Express response object to return project data or errors.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 JSON object of the project
 *  - 500 Internal Server Error if fetching fails
 */
export const getProjectsById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id: projectId } = req.params;
  const { classrooms, partial } = req.query;

  const where = { where: { id: projectId } };
  const project = classrooms
    ? await prisma.project.findUnique({
        ...where,
        include: {
          classroom: true,
        },
      })
    : partial
      ? await prisma.project.findUnique({
          ...where,
          select: {
            id: true,
            projectName: true,
          },
        })
      : await prisma.project.findUnique({
          ...where,
        });

  res.status(200).json({
    message: APP_RESPONSE_MESSAGE.project.projectReturned,
    project: project,
  });
};

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
export const postProjects = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { projectName } = req.body;
  const projectExists = await prisma.project.findUnique({
    where: { projectName },
  });

  if (projectExists) {
    res
      .status(409)
      .json({ message: APP_RESPONSE_MESSAGE.project.projectDoesExist });
    return;
  }
  try {
    const newProject = await createProject(req.body);
    res.status(201).json({
      message: APP_RESPONSE_MESSAGE.project.projectCreated,
      newData: newProject,
    });
  } catch {
    res.status(500).json({
      message: APP_RESPONSE_MESSAGE.serverError,
    });
    return;
  }
};

/**
 * Updates an existing project by ID using the service method.
 *
 * @function patchProject
 *
 * @param {Request} req - Express request object containing `id` in the URL and update fields in the body.
 * @param {Response} res - Express response object to return success or error messages.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 JSON with updated project data
 *  - 409 Conflict if project does not exist
 *  - 500 Internal Server Error if update fails
 */
export const patchProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const updatedProject = await updateProjectById(id, req.body);

    if (!updatedProject) {
      res
        .status(409)
        .json({ message: APP_RESPONSE_MESSAGE.project.projectDoesntExist });
      return;
    }

    res.status(200).json({
      message: APP_RESPONSE_MESSAGE.project.projectUpdated,
      newData: updatedProject,
    });
  } catch {
    res.status(500).json({ message: APP_RESPONSE_MESSAGE.serverError });
    return;
  }
};

/**
 * Deletes an existing project by ID using the service method.
 *
 * @function deleteProject
 *
 * @param {Request} req - Express request object containing `id` in the URL.
 * @param {Response} res - Express response object to return success or error messages.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 JSON with deleted project data
 *  - 409 Conflict if project does not exist
 *  - 500 Internal Server Error if deletion fails
 */
export const deleteProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedProject = await deleteProjectById(id);

    if (!deletedProject) {
      res
        .status(409)
        .json({ message: APP_RESPONSE_MESSAGE.project.projectDoesntExist });
      return;
    }

    res.status(200).json({
      message: APP_RESPONSE_MESSAGE.project.projectDeleted,
      newData: deletedProject,
    });
  } catch {
    res.status(500).json({ message: APP_RESPONSE_MESSAGE.serverError });
    return;
  }
};

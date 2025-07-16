import prisma from "@srvr/utils/db/prisma.ts";
import { Request, Response } from "express";
import {
  createProject,
  deleteManyProjectById,
  deleteProjectById,
  updateProjectById,
} from "./projects.service.ts";
import {
  APP_RESPONSE_MESSAGE,
  HTTP_RESPONSE_CODE,
} from "@srvr/configs/constants.config.ts";
import { Prisma } from "@prisma/client";

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
  const { classrooms, submissions, only_ids, partial } = req.query;
  // Convert query params to booleans
  const isClassroom = classrooms === "true";
  const isSubmission = submissions === "true";
  const isOnlyIds = only_ids === "true";

  const includeOptions: Prisma.ProjectSelect | undefined = {
    classrooms: isClassroom
      ? {
          select: {
            id: true,
            classroomName: true,
            course: {
              select: {
                courseCode: true,
                courseName: true,
              },
            },
          },
        }
      : false,
    submissions: isSubmission
      ? {
          select: {
            id: true,
            student: true,
            group: true,
            grade: true,
            feedback: true,
            files: true,
          },
        }
      : false,
  };

  const projects = isOnlyIds
    ? await prisma.project.findMany({
        select: {
          id: true,
          ...includeOptions,
        },
      })
    : partial
      ? await prisma.project.findMany({
          select: {
            id: true,
            projectName: true,
            ...includeOptions,
          },
        })
      : await prisma.project.findMany({
          select: {
            projectName: true,
            duration: true,
            id: true,
            visible: true,
            tags: true,
            createdAt: true,
            updatedAt: true,
            imageUrl: true,
            ...includeOptions,
          },
        });

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
  const { partial, studentsCount, projectContent } = req.query;

  // Convert query params to booleans
  const isStudentsCount = studentsCount === "true";
  const isProjectContent = projectContent === "true";

  const include: Prisma.ProjectInclude = {};
  if (isStudentsCount) {
    include.classrooms = {
      select: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    };
  }
  if (isProjectContent) {
    include.steps = {
      include: {
        contents: true,
        quizQuestions: true,
      },
    };
    include.discussions = true;
  }
  const where = { where: { id: projectId } };
  const project = partial
    ? await prisma.project.findUnique({
        ...where,
        select: {
          id: true,
          projectName: true,
        },
      })
    : await prisma.project.findUnique({
        ...where,
        include,
      });

  res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
    message: APP_RESPONSE_MESSAGE.project.projectReturned,
    projects: project,
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
      .status(HTTP_RESPONSE_CODE.CONFLICT)
      .json({ message: APP_RESPONSE_MESSAGE.project.projectDoesExist });
    return;
  }
  try {
    const newProject = await createProject(req.body);
    res.status(HTTP_RESPONSE_CODE.CREATED).json({
      message: APP_RESPONSE_MESSAGE.project.projectCreated,
      newData: newProject,
    });
  } catch {
    res.status(HTTP_RESPONSE_CODE.SERVER_ERROR).json({
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
        .status(HTTP_RESPONSE_CODE.CONFLICT)
        .json({ message: APP_RESPONSE_MESSAGE.project.projectDoesntExist });
      return;
    }

    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: APP_RESPONSE_MESSAGE.project.projectUpdated,
      newData: updatedProject,
    });
  } catch {
    res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ message: APP_RESPONSE_MESSAGE.serverError });
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
        .status(HTTP_RESPONSE_CODE.CONFLICT)
        .json({ message: APP_RESPONSE_MESSAGE.project.projectDoesntExist });
      return;
    }

    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: APP_RESPONSE_MESSAGE.project.projectDeleted,
      newData: deletedProject,
    });
  } catch {
    res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ message: APP_RESPONSE_MESSAGE.serverError });
    return;
  }
};

/**
 * Deletes an existing projects by ID using the service method.
 *
 * @function deleteProject
 *
 * @param {Request} req - Express request object containing `ids` in the req body.
 * @param {Response} res - Express response object to return success or error messages.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 JSON with deleted project data
 *  - 409 Conflict if project does not exist
 *  - 500 Internal Server Error if deletion fails
 */
export const deleteManyProjects = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const ids = req.body.ids;

  try {
    const deletedProject = await deleteManyProjectById(ids);

    if (!deletedProject) {
      res
        .status(HTTP_RESPONSE_CODE.CONFLICT)
        .json({ message: APP_RESPONSE_MESSAGE.project.projectDoesntExist });
      return;
    }

    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: APP_RESPONSE_MESSAGE.project.projectDeleted,
      newData: deletedProject,
    });
  } catch {
    res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ message: APP_RESPONSE_MESSAGE.serverError });
    return;
  }
};

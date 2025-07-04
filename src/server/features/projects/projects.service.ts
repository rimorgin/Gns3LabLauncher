import { ProjectTagsEnum } from "@prisma/client";
import { IProject } from "@srvr/types/models.type.ts";
import prisma from "@srvr/utils/db/prisma.ts";

/**
 * Creates a new project linked to a specific classroom.
 *
 * @function createProject
 *
 * @param {IProject} props - The project properties used to create the new project.
 * @param {string} props.projectname - The name of the project.
 * @param {string} props.description - A brief description of the project.
 * @param {string[]} props.classroomIds - The IDs of the classroom this project is associated with.
 * @param {boolean} props.visible - Whether the project should be visible to students.
 * @param {string} props.imageUrl - url path of the image and should always included in the payload
 * @param {Enum<"networking" | "cyberscurity">} props.tags should be networking or cybersecurity
 *
 * @returns {Promise<IProjects>} A promise that resolves to the newly created project instance.
 *
 * @throws {Error} If creating the project fails.
 */
export const createProject = async (props: IProject): Promise<IProject> => {
  const project = await prisma.project.create({
    data: {
      projectName: props.projectName,
      projectDescription: props.projectDescription,
      visible: props.visible,
      duration: props.duration,
      tags: props.tags as ProjectTagsEnum | null,
      imageUrl: props.imageUrl,
      classroom: {
        connect: (props.classroomIds ?? []).map((id) => ({ id })),
      },
    },
  });
  return {
    ...project,
    tags: project.tags as ProjectTagsEnum | null | undefined,
  };
};

/**
 * Updates an existing project with the provided details.
 *
 * @param {string} id - The ID of the project to update.
 * @param {Partial<IProject>} updates - The updates to apply to the project.
 * @returns {Promise<Partial<IProject> | null>} A promise that resolves to the updated project instance, or null if not found, and then return projectName.
 */
export const updateProjectById = async (
  id: string,
  updates: Partial<IProject>,
): Promise<Partial<IProject> | null> => {
  const updatedProject = await prisma.project.update({
    where: { id },
    data: updates,
  });
  return {
    ...updatedProject,
    tags: updatedProject.tags as ProjectTagsEnum | null | undefined,
  };
};
/**
 * Deletes a project by its ID.
 *
 * @param {string} id - The ID of the project to delete.
 * @returns {Promise<Partial<IProject> | null>} A promise that resolves to the deleted project instance, or null if not found, and then return projectName.
 */
export const deleteProjectById = async (
  id: string,
): Promise<Partial<IProject> | null> => {
  const deletedProject = await prisma.project.delete({
    where: { id },
    select: {
      projectName: true,
    },
  });
  return deletedProject;
};

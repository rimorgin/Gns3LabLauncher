import { Prisma, ProjectTagsEnum } from "@prisma/client";
import { IProject, ProgressData } from "@srvr/types/models.type.ts";
import prisma from "@srvr/utils/db/prisma.ts";
import uuidv4 from "@srvr/utils/uuidv4.utils.ts";

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
  const projectId = await uuidv4();
  const project = await prisma.project.create({
    data: {
      id: projectId,
      projectName: props.projectName,
      projectDescription: props.projectDescription,
      visible: props.visible,
      duration: props.duration,
      tags: props.tags as ProjectTagsEnum | null,
      imageUrl: props.imageUrl,
      classrooms: {
        connect: (props.classroomIds ?? []).map((id) => ({ id })),
      },
      // If your Submission model has a unique 'id' field, use it here. Adjust as needed for your schema.
      submissions: {
        connectOrCreate: {
          where: { id: projectId },
          create: {
            status: "idle",
          },
        },
      },
    },
  });

  // fetch students & groups in the classrooms
  const classroomStudentsAndGroups = await prisma.classroom.findMany({
    where: {
      id: { in: props.classroomIds ?? [] },
    },
    select: {
      id: true,
      students: { select: { userId: true } },
      studentGroups: { select: { id: true } },
    },
  });

  const progressData: ProgressData[] = [];

  for (const classroom of classroomStudentsAndGroups) {
    const classroomId = classroom.id;

    // student progress records
    for (const student of classroom.students) {
      progressData.push({
        projectId,
        classroomId,
        studentId: student.userId,
        percent: 0,
        status: "not-started",
      });
    }

    // group progress records
    for (const group of classroom.studentGroups) {
      progressData.push({
        projectId,
        classroomId,
        groupId: group.id,
        percent: 0,
        status: "not-started",
      });
    }
  }
  // insert all progress records in bulk
  if (progressData.length) {
    await prisma.progress.createMany({
      data: progressData,
    });
  }

  return project;
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
  const { classroomIds, ...rest } = updates as IProject;

  const data: Prisma.ProjectUpdateInput = {
    ...rest,
  };

  if (classroomIds) {
    data.classrooms = {
      connect: classroomIds.map((classroomId: string) => ({
        id: classroomId,
      })),
    };
  }

  const updatedProject = await prisma.project.update({
    where: { id },
    data,
  });

  return updatedProject;
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

/**
 * Deletes many projects by its ID.
 *
 * @param {string[]} ids - The IDs of the project to delete.
 * @returns {Promise<Partial<IProject> | null>} A promise that resolves to the deleted project instance, or null if not found, and then return projectName.
 */
export const deleteManyProjectById = async (
  ids: string[],
): Promise<Partial<IProject>[]> => {
  const deletedProject = await prisma.$transaction(
    ids.map((id) =>
      prisma.project.delete({
        where: { id },
        select: { projectName: true }, // select only needed fields
      }),
    ),
  );
  return deletedProject;
};

import { Prisma } from "@prisma/client";
import { IClassroom } from "@srvr/types/models.type.ts";
import prisma from "@srvr/utils/db/prisma.ts";

/**
 * Creates a new classroom associated with a specific course.
 *
 * @function createClassroom
 *
 * @param {IClassroom} props - The classroom properties used to create the new classroom.
 * @param {ObjectId} props.courseId - The ID of the course this classroom belongs to.
 * @param {string} props.classname - The name/identifier of the classroom.
 * @param {string} props.instructor - The instructor assigned to the classroom.
 * @param {string} props.status - The current status of the classroom (e.g., active, inactive).
 *
 * @returns {Promise<IClassroom>} A promise that resolves to the newly created classroom instance.
 *
 * @throws {Error} If creating the classroom fails.
 */
export const createClassroom = async (
  props: IClassroom,
): Promise<IClassroom> => {
  const classroom = await prisma.classroom.create({
    data: {
      courseId: props.courseId,
      classroomName: props.classroomName,
      instructorId: props.instructorId,
      status: props.status,

      students: {
        connect: (props.studentIds ?? []).map((id) => ({ userId: id })),
      },
      /* ASSIGNING PROJECTS SHOULD BE IN THE PROJECTS SIDE projects: {
        connect: (props.projectIds ?? []).map((id) => ({ id })),
      }, */
      imageUrl: props.imageUrl,
    },
  });
  return {
    ...classroom,
    courseId: classroom.courseId ?? "",
    instructorId: classroom.instructorId ?? "",
  };
};

/**
 * Updates an existing classroom with the provided details.
 *
 * @param {string} id - The ID of the classroom to update.
 * @param {Partial<IClassroom>} updates - The updates to apply to the classroom.
 * @returns {Promise<Partial<IClassroom> | null>} A promise that resolves to the updated classroom instance, or null if not found, and then return classroomName.
 */
export const updateClassroomById = async (
  id: string,
  updates: Partial<IClassroom>,
): Promise<Partial<IClassroom> | null> => {
  const updatedData: Prisma.ClassroomUpdateInput = {};
  if (updates.classroomName) updatedData.classroomName = updates.classroomName;
  if (updates.status) updatedData.status = updates.status;
  if (updates.courseId)
    updatedData.course = { connect: { id: updates.courseId } };
  if (updates.projectIds)
    updatedData.projects = {
      set: updates.projectIds.map((projectId) => ({ id: projectId })),
    };
  if (updates.instructorId)
    updatedData.instructor = {
      connect: { userId: updates.instructorId },
    };
  if (updates.studentIds) {
    updatedData.students = {
      set: updates.studentIds.map((userId) => ({ userId })),
    };
  }

  const updatedClassroom = await prisma.classroom.update({
    where: { id },
    data: updatedData,
  });
  return {
    ...updatedClassroom,
    courseId: updatedClassroom.courseId ?? undefined,
    instructorId: updatedClassroom.instructorId ?? undefined,
  };
};
/**
 * Deletes a classroom by its ID.
 *
 * @param {string} id - The ID of the classroom to delete.
 * @returns {Promise<Partial<IClassroom> | null>} A promise that resolves to the deleted classroom instance, or null if not found, and then return classroomName.
 */
export const deleteClassroomById = async (
  id: string,
): Promise<Partial<IClassroom> | null> => {
  const deletedClassroom = await prisma.classroom.delete({
    where: { id },
    select: {
      classroomName: true,
    },
  });
  return deletedClassroom;
};

/**
 * Deletes multiple classroom by their IDs.
 *
 * @param {string[]} ids - The IDs of the classroom to delete.
 * @returns {Promise<Array<Partial<IClassroom>>>} An array of deleted classrooms (partial), or empty if none were found.
 */
export const deleteManyClassroomsById = async (
  ids: string[],
): Promise<Partial<IClassroom>[]> => {
  const deletedClassrooms = await prisma.$transaction(
    ids.map((id) =>
      prisma.classroom.delete({
        where: { id },
        select: { classroomName: true }, // select only needed fields
      }),
    ),
  );

  return deletedClassrooms;
};

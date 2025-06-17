import { IClassroom } from "@srvr/types/models.type.ts";
import prisma from "@srvr/utils/db/prisma.ts";

/**
 * Creates a new classroom associated with a specific course.
 *
 * @function createClassroom
 *
 * @param {IClassroom} props - The classroom properties used to create the new classroom.
 * @param {ObjectId} props.courseid - The ID of the course this classroom belongs to.
 * @param {string} props.classname - The name/identifier of the classroom.
 * @param {string} props.instructor - The instructor assigned to the classroom.
 * @param {string} props.status - The current status of the classroom (e.g., active, inactive).
 *
 * @returns {Promise<IClassroom>} A promise that resolves to the newly created classroom instance.
 *
 * @throws {Error} If creating the classroom fails.
 */
export const createClassroom = async (
  props: IClassroom
): Promise<IClassroom> => {
  const classroom = await prisma.classroom.create({
    data: {
      courseId: props.courseId,
      classroomName: props.classroomName,
      instructorId: props.instructorId,
      status: props.status,

      students: {
        connect: (props.studentIds ?? []).map((id) => ({ userId: id }))
      },
      projects: {
        connect:  (props.projectIds ?? []).map((id) => ({ id }))
      }
    }
  });
  return classroom;
};

/**
 * Updates an existing classroom with the provided details.
 *
 * @param {string} id - The ID of the classroom to update.
 * @param {Partial<IClassroom>} updates - The updates to apply to the classroom.
 * @returns {Promise<Partial<IClassroom> | null>} A promise that resolves to the updated classroom instance, or null if not found, and then return classroomName.
 */
export const updateClassroom = async (
  id: string,
  updates: Partial<IClassroom>
): Promise<Partial<IClassroom> | null> => {
  const updatedClassroom = await prisma.classroom.update({
    where: { id },
    data: updates,
    select: {
      classroomName: true
    }
  })
  return updatedClassroom;
};
/**
 * Deletes a classroom by its ID.
 *
 * @param {string} id - The ID of the classroom to delete.
 * @returns {Promise<Partial<IClassroom> | null>} A promise that resolves to the deleted classroom instance, or null if not found, and then return classroomName.
 */
export const deleteClassroom = async (
  id: string
): Promise<Partial<IClassroom> | null> => {
  const deletedClassroom = await prisma.classroom.delete({
    where: { id },
    select: {
      classroomName: true
    }
  })
  return deletedClassroom;
};
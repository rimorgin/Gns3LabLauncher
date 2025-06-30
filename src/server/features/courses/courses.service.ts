import { ICourse } from "@srvr/types/models.type.ts";
import prisma from "@srvr/utils/db/prisma.ts";

/**
 * Creates a new course with the provided course code and name.
 *
 * @function createCourse
 *
 * @param {ICourse} props - The course properties used to create the new course.
 * @param {string} props.coursecode - The unique identifier code for the course.
 * @param {string} props.coursename - The full name of the course.
 *
 * @returns {Promise<ICourse>} A promise that resolves to the newly created course instance.
 *
 * @throws {Error} If creating the course fails.
 */
export const createCourse = async (props: ICourse): Promise<ICourse> => {
  const course = await prisma.course.create({
    data: {
      courseCode: props.courseCode,
      courseName: props.courseName,
      classrooms: {
        connect: (props.classroomIds ?? []).map((id) => ({ id })),
      },
    },
  });
  return course;
};

/**
 * Updates an existing course with the provided details.
 *
 * @param {string} id - The ID of the course to update.
 * @param {Partial<ICourse>} updates - The updates to apply to the course.
 * @returns {Promise<Partial<ICourse> | null>} A promise that resolves to the updated course instance, or null if not found, and return courseCode as a result
 */
export const updateCourseById = async (
  id: string,
  updates: Partial<ICourse>,
): Promise<Partial<ICourse> | null> => {
  const updatedCourse = await prisma.course.update({
    where: { id },
    data: updates,
    select: {
      courseCode: true,
    },
  });
  return updatedCourse;
};
/**
 * Deletes a course by its ID.
 *
 * @param {/string} id - The ID of the course to delete.
 * @returns {Promise<Partial<ICourse> | null>} A promise that resolves to the deleted course instance, or null if not found, and return courseCode as a result
 */
export const deleteCourseById = async (
  id: string,
): Promise<Partial<ICourse> | null> => {
  const deletedCourse = await prisma.course.delete({
    where: { id },
    select: {
      courseCode: true,
    },
  });
  return deletedCourse;
};

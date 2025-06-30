import { IUserGroup } from "@srvr/types/models.type.ts";
import { randomWords } from "../../utils/db/helpers.ts";
import prisma from "../../utils/db/prisma.ts";

/**
 * Creates a new user in the PostgreSQL database using Prisma, including role-based creation logic.
 * Capitalizes the name and hashes the password before persisting.
 *
 * @function createUserGroup
 *
 * @param {IUserWithRoleInput} props - The properties required to create the user, including role-specific fields.
 * @param {string} props.name - The full name of the user (will be capitalized).
 * @param {string} props.email - The user's email address.
 * @param {string} props.username - The unique username for the user.
 * @param {string} props.password - The raw password to be hashed before storing.
 * @param {"administrator" | "instructor" | "student"} props.role - The role assigned to the user.
 *
 * @param {Object} [props.instructor] - Instructor-specific data (only required if role is "instructor").
 * @param {string[]} props.instructor.specialty - Array of strings representing the instructor's specialties.
 * @param {string[]} props.instructor.classroomIds - List of classroom IDs associated with the instructor.
 *
 * @param {Object} [props.student] - Student-specific data (only required if role is "student").
 * @param {string[]} props.student.classroomIds - List of classroom IDs associated with the student.
 *
 * @returns {Promise<IUserWithRoleOutput>} A promise that resolves to the created user object (without password), including role-based properties.
 *
 * @throws {Error} If hashing the password or database operations fail.
 */
export const createUserGroup = async (
  props: IUserGroup,
): Promise<Partial<IUserGroup>> => {
  const groupName = props.groupName ?? randomWords()[0];
  const user_group = await prisma.userGroups.create({
    data: {
      groupName: groupName,
      student: {
        connect: (props.studentIds ?? []).map((id) => ({ userId: id })),
      },
    },
  });

  return user_group;
};

/**
 * Updates an existing user with the provided details.
 *
 * @param {string} id - The ID of the user to update.
 * @param {Partial<IUserBaseInput>} updates - The updates to apply to the user.
 * @returns {Promise<Partial<IUserBaseOutput> | null>} A promise that resolves to the updated user instance, or null if not found, and returns username as a result.
 */
export const updateUserGroupById = async (
  id: string,
  updates: Partial<IUserGroup>,
): Promise<Partial<IUserGroup> | null> => {
  const { studentIds, ...rest } = updates;

  const updatedUserGroup = await prisma.userGroups.update({
    where: { id },
    data: {
      ...rest,
      ...(studentIds && {
        student: {
          set: [],
          connect: studentIds.map((id) => ({ userId: id })),
        },
      }),
    },
    select: {
      groupName: true,
      student: true,
    },
  });

  return updatedUserGroup;
};

/**
 * Deletes a user by their ID.
 *
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<Partial<IUserBaseOutput> | null>} A promise that resolves to the deleted user instance, or null if not found, and returns a username as a  result.
 */
export const deleteUserGroupById = async (
  id: string,
): Promise<Partial<IUserGroup> | null> => {
  const deletedUserGroup = await prisma.userGroups.delete({
    where: { id },
    select: {
      groupName: true,
    },
  });
  return deletedUserGroup;
};

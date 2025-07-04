import {
  InstructorUserInput,
  IUserBaseInput,
  IUserBaseOutput,
  IUserWithRoleInput,
  IUserWithRoleOutput,
  StudentUserInput,
} from "@srvr/types/models.type.ts";
import { capitalizedString, hashString } from "../../utils/db/helpers.ts";
import uuidv4 from "@srvr/utils/uuidv4.utils.ts";
import prisma from "../../utils/db/prisma.ts";
import { Prisma } from "@prisma/client";

/**
 * Creates a new user in the PostgreSQL database using Prisma, including role-based creation logic.
 * Capitalizes the name and hashes the password before persisting.
 *
 * @function createUser
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
export const createUser = async (
  props: IUserWithRoleInput,
): Promise<IUserWithRoleOutput> => {
  const capitalizedName = capitalizedString(props.name);
  const hashedPassword = await hashString(props.password, 12);
  const userId = await uuidv4();
  const user = await prisma.user.create({
    data: {
      id: userId,
      name: capitalizedName,
      email: props.email,
      username: props.username,
      password: hashedPassword,
      role: props.role,
      administrator:
        props.role === "administrator"
          ? {
              connectOrCreate: {
                where: { userId: userId },
                create: {},
              },
            }
          : undefined,
      instructor:
        props.role === "instructor"
          ? {
              connectOrCreate: {
                where: { userId: userId },
                create: {
                  expertise: props.instructor.expertise,
                  classrooms: {
                    connect: (props.instructor?.classroomIds ?? []).map(
                      (id) => ({ id }),
                    ),
                  },
                },
              },
            }
          : undefined,
      student:
        props.role === "student"
          ? {
              connectOrCreate: {
                where: { userId: userId },
                create: {
                  userGroups: {
                    connect: (props.student?.groupIds ?? []).map((id) => ({
                      id,
                    })),
                  },
                  classrooms: {
                    connect: (props.student?.classroomIds ?? []).map((id) => ({
                      id,
                    })),
                  },
                },
              },
            }
          : undefined,
    },
    include: {
      student: props.role === "student",
      instructor: props.role === "instructor",
      administrator: props.role === "administrator",
    },
    omit: { password: true },
  });
  return user;
};

/**
 * Updates an existing user with the provided details.
 *
 * @param {string} id - The ID of the user to update.
 * @param {Partial<IUserBaseInput>} updates - The updates to apply to the user.
 * @returns {Promise<Partial<IUserBaseOutput> | null>} A promise that resolves to the updated user instance, or null if not found, and returns username as a result.
 */
export const updateUserById = async (
  id: string,
  updates: Partial<IUserBaseInput & (InstructorUserInput | StudentUserInput)>,
): Promise<Partial<IUserWithRoleOutput> | null> => {
  if (updates.password) {
    updates.password = await hashString(updates.password, 12);
  }
  console.log("to update: ", updates);
  const userData: Prisma.UserUpdateInput = {};

  if (updates.name) userData.name = updates.name;
  if (updates.email) userData.email = updates.email;
  if (updates.username) userData.username = updates.username;
  if (updates.password) userData.password = updates.password;
  if (updates.role) userData.role = updates.role;

  if (updates.role === "instructor" && updates.instructor) {
    userData.instructor = {
      update: {
        ...(updates.instructor.expertise && {
          expertise: updates.instructor.expertise,
        }),
        ...(updates.instructor.classroomIds && {
          classrooms: {
            set: (updates.instructor.classroomIds ?? []).map((id) => ({
              id,
            })),
          },
        }),
      },
    };
  }

  if (updates.role === "student" && updates.student) {
    userData.student = {
      update: {
        ...(updates.student.groupIds && {
          userGroups: {
            set: (updates.student.groupIds ?? []).map((id) => ({ id })),
          },
        }),
        ...(updates.student.classroomIds && {
          classrooms: {
            set: (updates.student.classroomIds ?? []).map((id) => ({ id })),
          },
        }),
      },
    };
  }

  console.log("🚀 ~ userData:", userData);

  const updatedUser = await prisma.user.update({
    where: { id },
    data: userData,
  });
  return updatedUser;
};

/**
 * Deletes a user by their ID.
 *
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<Partial<IUserBaseOutput> | null>} A promise that resolves to the deleted user instance, or null if not found, and returns a username as a  result.
 */
export const deleteUserById = async (
  id: string,
): Promise<Partial<IUserBaseOutput> | null> => {
  const deletedUser = await prisma.user.delete({
    where: { id },
    select: {
      username: true,
    },
  });
  return deletedUser;
};

/**
 * Deletes multiple users by their IDs.
 *
 * @param {string[]} ids - The IDs of the users to delete.
 * @returns {Promise<Array<Partial<IUserBaseOutput>>>} An array of deleted users (partial), or empty if none were found.
 */
export const deleteManyUsersById = async (
  ids: string[],
): Promise<Partial<IUserBaseOutput>[]> => {
  const deletedUsers = await prisma.$transaction(
    ids.map((id) =>
      prisma.user.delete({
        where: { id },
        select: { username: true }, // select only needed fields
      }),
    ),
  );

  return deletedUsers;
};

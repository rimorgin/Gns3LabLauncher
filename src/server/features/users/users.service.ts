import {
  InstructorUserInput,
  IUserBaseInput,
  IUserBaseOutput,
  IUserWithRoleInput,
  IUserWithRoleOutput,
  StudentUserInput,
} from "@srvr/types/models.type.ts";
import { capitalizedString, hashString } from "@srvr/utils/db/helpers.ts";
import uuidv4 from "@srvr/utils/uuidv4.utils.ts";
import prisma from "@srvr/utils/db/prisma.ts";
import { Prisma, UserRolesEnum } from "@prisma/client";

export class UserService {
  static async getMe(id?: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            classrooms: {
              include: {
                course: {
                  select: {
                    courseCode: true,
                    courseName: true,
                  },
                },
              },
            },
            userGroups: true,
            progress: true,
            labProgress: true,
            submissions: true,
          },
        },
        instructor: {
          include: {
            classrooms: {
              include: {
                course: {
                  select: {
                    courseCode: true,
                    courseName: true,
                  },
                },
              },
            },
          },
        },
      },
      omit: { password: true },
    });
    return user;
  }
  /**
   * Fetches a list of users from the database, supporting flexible query (options) parameters:
   *
   * - `role` (optional): Filter users by exact role (`student`, `instructor`, etc.).
   * - `only_ids` (optional): If `"true"`, only returns `{ id }` for each user.
   * - `includeRoleData` (optional): If `"true"`, includes role-specific data (`student` or `instructor`).
   * - `includeRoleRelations` (optional): If `"true"`, deeply includes role-related relations (like classrooms, submissions, etc.).
   *
   * Default behavior:
   * - If no `role` is given, excludes users with `administrator` role.
   *
   * Example use cases:
   * - Get all students: `?role=student`
   * - Get all instructors with classrooms: `?role=instructor&includeRoleData=true&includeRoleRelations=true`
   * - Just IDs of students: `?role=student&only_ids=true`
   *
   * @method fetchUsers
   * @param {{
   *   role?: string;
   *   only_ids?: string;
   *   includeRoleData?: string;
   *   includeRoleRelations?: string;
   * }} options - The query parameters from the request.
   *
   * @returns {Promise<object[]>} Array of user objects matching the criteria.
   *
   * @throws Will throw if the database query fails.
   */
  static async getAll(options: {
    role?: string;
    only_ids?: string;
    includeRoleData?: string;
    includeRoleRelations?: string;
  }): Promise<object[]> {
    const { role, only_ids, includeRoleData, includeRoleRelations } = options;

    const where: Prisma.UserWhereInput = role
      ? { role: role as UserRolesEnum }
      : { role: { not: UserRolesEnum.administrator } };

    let select: Prisma.UserSelect | undefined;

    if (only_ids === "true") {
      select = { id: true };
    } else {
      select = {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        student:
          includeRoleData === "true"
            ? {
                select: {
                  userGroups: includeRoleRelations === "true" ? true : false,
                  classrooms:
                    includeRoleRelations === "true"
                      ? {
                          include: {
                            course: {
                              select: {
                                courseCode: true,
                                courseName: true,
                              },
                            },
                          },
                        }
                      : false,
                  submissions: includeRoleRelations === "true" ? true : false,
                  progress: includeRoleRelations === "true" ? true : false,
                  isOnline: true,
                  lastActiveAt: true,
                },
              }
            : false,
        instructor:
          includeRoleData === "true"
            ? {
                select: {
                  classrooms:
                    includeRoleRelations === "true"
                      ? {
                          include: {
                            course: {
                              select: {
                                courseCode: true,
                                courseName: true,
                              },
                            },
                          },
                        }
                      : false,
                  expertise: includeRoleRelations === "true" ? true : false,
                  isOnline: true,
                  lastActiveAt: true,
                },
              }
            : false,
      };
    }

    const users = await prisma.user.findMany({
      where,
      ...(select && { select }),
    });

    return users;
  }
  static async getById(
    id: string,
    options: {
      only_ids?: string;
      includeRoleData?: string;
      includeRoleRelations?: string;
    },
  ): Promise<object[]> {
    const { only_ids, includeRoleData, includeRoleRelations } = options;

    let select: Prisma.UserSelect | undefined;

    if (only_ids === "true") {
      select = { id: true };
    } else {
      select = {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        student:
          includeRoleData === "true"
            ? {
                select: {
                  userGroups: includeRoleRelations === "true" ? true : false,
                  classrooms:
                    includeRoleRelations === "true"
                      ? {
                          include: {
                            course: {
                              select: {
                                courseCode: true,
                                courseName: true,
                              },
                            },
                          },
                        }
                      : false,
                  submissions: includeRoleRelations === "true" ? true : false,
                  progress: includeRoleRelations === "true" ? true : false,
                  isOnline: true,
                  lastActiveAt: true,
                },
              }
            : false,
        instructor:
          includeRoleData === "true"
            ? {
                select: {
                  classrooms:
                    includeRoleRelations === "true"
                      ? {
                          include: {
                            course: {
                              select: {
                                courseCode: true,
                                courseName: true,
                              },
                            },
                          },
                        }
                      : false,
                  expertise: includeRoleRelations === "true" ? true : false,
                  isOnline: true,
                  lastActiveAt: true,
                },
              }
            : false,
      };
    }

    const users = await prisma.user.findMany({
      where: { id },
      ...(select && { select }),
    });

    return users;
  }
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
  static async create(props: IUserWithRoleInput): Promise<IUserWithRoleOutput> {
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
                  where: { userId },
                  create: {},
                },
              }
            : undefined,
        instructor:
          props.role === "instructor"
            ? {
                connectOrCreate: {
                  where: { userId },
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
                  where: { userId },
                  create: {
                    userGroups: {
                      connect: (props.student?.groupIds ?? []).map((id) => ({
                        id,
                      })),
                    },
                    classrooms: {
                      connect: (props.student?.classroomIds ?? []).map(
                        (id) => ({ id }),
                      ),
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
  }
  /**
   * Creates multiple users in the database, applying role-based logic,
   * name capitalization, and password hashing.
   *
   * Runs in a single transaction — if any user creation fails, the entire
   * operation is rolled back.
   *
   * @param {IUserWithRoleInput[]} users - Array of user payloads.
   * @returns {Promise<IUserWithRoleOutput[]>} The created users without passwords.
   */
  static async createBulk(
    users: IUserWithRoleInput[],
  ): Promise<IUserWithRoleOutput[]> {
    const result = await prisma.$transaction(
      async (tx) => {
        const createdUsers: IUserWithRoleOutput[] = [];

        for (const user of users) {
          const capitalizedName = capitalizedString(user.name);
          const hashedPassword = await hashString(user.password, 12);
          const userId = uuidv4();

          const created = await tx.user.create({
            data: {
              id: userId,
              name: capitalizedName,
              email: user.email,
              username: user.username,
              password: hashedPassword,
              role: user.role,
              administrator:
                user.role === "administrator"
                  ? {
                      connectOrCreate: {
                        where: { userId },
                        create: {},
                      },
                    }
                  : undefined,
              instructor:
                user.role === "instructor"
                  ? {
                      connectOrCreate: {
                        where: { userId },
                        create: {
                          expertise: user.instructor.expertise,
                          classrooms: {
                            connect: (user.instructor?.classroomIds ?? []).map(
                              (id) => ({ id }),
                            ),
                          },
                        },
                      },
                    }
                  : undefined,
              student:
                user.role === "student"
                  ? {
                      connectOrCreate: {
                        where: { userId },
                        create: {
                          userGroups: {
                            connect: (user.student?.groupIds ?? []).map(
                              (id) => ({ id }),
                            ),
                          },
                          classrooms: {
                            connect: (user.student?.classroomIds ?? []).map(
                              (id) => ({ id }),
                            ),
                          },
                        },
                      },
                    }
                  : undefined,
            },
            include: {
              student: user.role === "student",
              instructor: user.role === "instructor",
              administrator: user.role === "administrator",
            },
            omit: { password: true },
          });
          createdUsers.push(created);
        }

        return createdUsers;
      },
      {
        timeout: 60_000,
        maxWait: 60_000,
      },
    );

    return result;
  }

  /**
   * Updates an existing user with the provided details.
   *
   * @param {string} id - The ID of the user to update.
   * @param {Partial<IUserBaseInput>} updates - The updates to apply to the user.
   * @returns {Promise<Partial<IUserBaseOutput> | null>} A promise that resolves to the updated user instance, or null if not found, and returns username as a result.
   */
  static async updateById(
    id: string,
    updates: Partial<IUserBaseInput & (InstructorUserInput | StudentUserInput)>,
  ): Promise<Partial<IUserWithRoleOutput> | null> {
    if (updates.password) {
      updates.password = await hashString(updates.password, 12);
    }

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

    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
      omit: { password: true },
    });
    return updatedUser;
  }

  /**
   * Deletes a user by their ID.
   *
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<Partial<IUserBaseOutput> | null>} A promise that resolves to the deleted user instance, or null if not found, and returns a username as a  result.
   */
  static async deleteById(
    id: string,
  ): Promise<Partial<IUserBaseOutput> | null> {
    const deletedUser = await prisma.user.delete({
      where: { id },
      select: {
        username: true,
      },
    });
    return deletedUser;
  }
  /**
   * Deletes multiple users by their IDs.
   *
   * @param {string[]} ids - The IDs of the users to delete.
   * @returns {Promise<Array<Partial<IUserBaseOutput>>>} An array of deleted users (partial), or empty if none were found.
   */
  static async deleteManyById(
    ids: string[],
  ): Promise<Partial<IUserBaseOutput>[]> {
    const deletedUsers = await prisma.$transaction(
      ids.map((id) =>
        prisma.user.delete({
          where: { id },
          select: { username: true },
        }),
      ),
    );

    return deletedUsers;
  }
}

import { Prisma } from "@prisma/client";
import { IUserGroup } from "@srvr/types/models.type.ts";
import { randomWords } from "@srvr/utils/db/helpers.ts";
import prisma from "@srvr/utils/db/prisma.ts";
import { getRandomImageUrlImage } from "@srvr/utils/random-image-url.utils.ts";

/**
 * Service for managing user groups in the database.
 */
export class UserGroupService {
  /**
   * Retrieves all user groups.
   *
   * @param query Query params: `student`, `classroom`, `ids`
   * @returns Array of user groups
   */
  static async getAll(query: {
    student?: string;
    classroom?: string;
    ids?: string | string[];
    by_classroom_only_id?: string;
  }): Promise<Partial<IUserGroup>[]> {
    const { student, classroom, ids, by_classroom_only_id } = query;

    const include: Prisma.UserGroupsInclude = {};

    if (student) {
      include.student = {
        include: {
          user: {
            select: {
              name: true,
              username: true,
              email: true,
            },
          },
        },
      };
    }

    if (classroom) {
      include.classrooms = {
        select: {
          id: true,
          classroomName: true,
          course: {
            select: {
              courseName: true,
              courseCode: true,
            },
          },
        },
      };
    }

    const idArray = Array.isArray(ids)
      ? ids.map(String)
      : ids
        ? [String(ids)]
        : [];

    const userGroups = await prisma.userGroups.findMany({
      where: {
        ...(idArray.length > 0
          ? { id: { in: idArray } }
          : { classroomId: by_classroom_only_id }),
      },
      ...(Object.keys(include).length > 0 ? { include } : {}),
    });

    return userGroups;
  }

  /**
   * Retrieves a user group by ID.
   *
   * @param id User group ID
   * @returns The user group or null
   */
  static async getById(id: string): Promise<Partial<IUserGroup> | null> {
    const userGroup = await prisma.userGroups.findUnique({
      where: { id },
    });
    return userGroup;
  }
  /**
   * Creates a new user group.
   *
   * Capitalizes the name if provided, generates a random one if not,
   * and associates it with students and a classroom.
   *
   * @function create
   * @param {IUserGroup} props - The properties to create the user group.
   * @param {string} props.groupName - Optional name of the group.
   * @param {string} props.classroomId - Classroom the group belongs to.
   * @param {string[]} props.studentIds - Optional list of student user IDs.
   * @param {number} props.limit - Optional student limit.
   * @param {string} props.imageUrl - Optional group image.
   * @returns {Promise<Partial<IUserGroup>>} The created user group.
   */
  static async create(props: IUserGroup): Promise<Partial<IUserGroup>> {
    const groupName = props.groupName ?? randomWords()[0];
    const imageUrl = getRandomImageUrlImage("userGroups");
    const user_group = await prisma.userGroups.create({
      data: {
        groupName,
        classroomId: props.classroomId,
        limit: props.limit,
        student: {
          connect: (props.studentIds ?? []).map((id) => ({ userId: id })),
        },
        imageUrl: imageUrl,
      },
    });

    return user_group;
  }

  /**
   * Updates an existing user group.
   *
   * @function updateById
   * @param {string} id - ID of the group to update.
   * @param {Partial<IUserGroup>} updates - Fields to update.
   * @returns {Promise<Partial<IUserGroup> | null>} Updated group or null.
   */
  static async updateById(
    id: string,
    updates: Partial<IUserGroup>,
  ): Promise<Partial<IUserGroup> | null> {
    const { studentIds, ...rest } = updates as IUserGroup;

    const updatedUserGroup = await prisma.userGroups.update({
      where: { id },
      data: {
        ...rest,
        ...(studentIds && {
          student: {
            set: (studentIds ?? []).map((id) => ({ userId: id })),
          },
        }),
      },
      include: {
        student: true,
      },
    });

    return updatedUserGroup;
  }

  /**
   * Deletes a user group by ID.
   *
   * @function deleteById
   * @param {string} id - ID of the group to delete.
   * @returns {Promise<Partial<IUserGroup> | null>} Deleted group name or null.
   */
  static async deleteById(id: string): Promise<Partial<IUserGroup> | null> {
    const deletedUserGroup = await prisma.userGroups.delete({
      where: { id },
      select: {
        groupName: true,
      },
    });
    return deletedUserGroup;
  }

  /**
   * Deletes many user groups by their IDs.
   *
   * @function deleteManyById
   * @param {string[]} ids - Array of IDs to delete.
   * @returns {Promise<Partial<IUserGroup>[]>} Deleted group names.
   */
  static async deleteManyById(ids: string[]): Promise<Partial<IUserGroup>[]> {
    const deletedUserGroups = await prisma.$transaction(
      ids.map((id) =>
        prisma.userGroups.delete({
          where: { id },
          select: { groupName: true },
        }),
      ),
    );
    return deletedUserGroups;
  }
}

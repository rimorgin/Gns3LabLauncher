import { IUserGroup } from "@srvr/types/models.type.ts";
import { randomWords } from "../../utils/db/helpers.ts";
import prisma from "../../utils/db/prisma.ts";

/**
 * Creates a new user in the PostgreSQL database using Prisma, including role-based creation logic.
 * Capitalizes the name and hashes the password before persisting.
 *
 * @function createUserGroup
 *
 * @param {IUserGroup} props - The properties required to create the user group, including role-specific fields.
 * @param {string} props.groupName - The name of the user group (optional).
 * @param {string} props.classroomId - The classroom that the user group is associated with.
 * @param {string} props.studentIds - The ids of the student users that will be assigned with this group (optional).
 *
 * @returns {Promise<Partial<IUserGroup>>} A promise that resolves to the created user group object.
 */
export const createUserGroup = async (
  props: IUserGroup,
): Promise<Partial<IUserGroup>> => {
  const groupName = props.groupName ?? randomWords()[0];
  const user_group = await prisma.userGroups.create({
    data: {
      groupName: groupName,
      ...(props.classroomId && { classroomId: props.classroomId }),
      ...(props.studentIds && {
        student: {
          connect: (props.studentIds ?? []).map((id) => ({ userId: id })),
        },
      }),
      imageUrl: props.imageUrl,
    },
  });

  return user_group;
};

/**
 * Updates an existing user group with the provided details.
 *
 * @param {string} id - The ID of the user group to update.
 * @param {Partial<IUserGroup>} updates - The updates to apply to the user group.
 * @returns {Promise<Partial<IUserGroup> | null>} A promise that resolves to the updated user group instance, or null if not found, and returns username as a result.
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
  });

  return updatedUserGroup;
};

/**
 * Deletes a user group by their ID.
 *
 * @param {string} id - The ID of the user group to delete.
 * @returns {Promise<Partial<IUserBaseOutput> | null>} A promise that resolves to the deleted user group instance, or null if not found, and returns a username as a  result.
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

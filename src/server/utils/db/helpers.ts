import { Prisma } from "@prisma/client";
import {
  Permission,
  Role,
  RoleName,
  RolesCollection,
} from "@srvr/types/auth.type.ts";
import bcrypt from "bcrypt";
import { generate } from "random-words";

/**
 * Checks whether a given role has a specific permission.
 *
 * @param {Role} role - The role object to check permissions for.
 * @param {Permission} permission - The permission string (e.g., 'read_dashboard', 'delete_user') to verify.
 *
 * @returns {boolean} `true` if the role has the permission; otherwise, `false`.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return role.permissions.includes(permission);
}

/**
 * Retrieves the list of permissions associated with a given role name.
 *
 * @param {RolesCollection} roles - The collection of all roles defined in the system.
 * @param {RoleName} roleName - The name of the role (e.g., 'admin', 'student') to retrieve permissions for.
 *
 * @returns {Permission[]} An array of permissions assigned to the specified role.
 * Returns an empty array if the role is not found.
 */
export function getRolePermissions(
  roles: RolesCollection,
  roleName: RoleName,
): Permission[] {
  const role = roles.roles.find((r) => r.name === roleName);
  return role?.permissions ?? [];
}

/**
 * Capitalizes the first letter of each word in the given string.
 *
 * @function capitalizedString
 *
 * @param {string} text - The input string to be transformed (e.g., a full name).
 *
 * @returns {string} The transformed string with each word capitalized.
 *
 * @example
 * capitalizedString("john doe") // "John Doe"
 */
export function capitalizedString(text: string) {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Hashes a given string (typically a password) using bcrypt.
 *
 * @async
 * @function hashString
 *
 * @param {string} text - The string to hash (e.g., a password).
 * @param {number} [saltRounds=12] - Optional salt rounds used in bcrypt hashing.
 *
 * @returns {Promise<string>} A promise that resolves to the hashed string.
 *
 * @throws {Error} If hashing fails.
 *
 * @example
 * const hashed = await hashString("myPassword");
 */
export async function hashString(text: string, saltRounds: number = 12) {
  return await bcrypt.hash(text, saltRounds);
}

export function randomWords(
  wordsMaxLength: number = 5,
  wordsPerString: number = 2,
  separator: string = "-",
  exactly: number = 1,
) {
  return generate({
    exactly: exactly,
    minLength: wordsMaxLength,
    separator: separator,
    wordsPerString: wordsPerString,
  });
}

export function prismaErrorCode(
  error: unknown,
): { status: number; message: string } | undefined {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    let status: number;

    switch (error.code) {
      case "P2002": // Unique constraint
        status = 409;
        break;

      case "P2025": // Record not found
        status = 404;
        break;

      case "P2003": // Foreign key constraint
        status = 400;
        break;

      default:
        status = 400;
        break;
    }

    return {
      status,
      message: error.message,
    };
  }

  return undefined;
}

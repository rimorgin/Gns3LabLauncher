import { Prisma } from "@prisma/client";
import {
  APP_RESPONSE_MESSAGE,
  HTTP_RESPONSE_CODE,
} from "@srvr/configs/constants.config.ts";
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

type ModelKeys = keyof typeof APP_RESPONSE_MESSAGE;

// Helper to get dynamic message like `userDoesExist`, `projectDoesntExist`, etc.
function getMessage(
  model: ModelKeys,
  suffix: "DoesExist" | "DoesntExist",
): string | undefined {
  const base = model.slice(0, -1); // crude singularization (e.g., "users" -> "user")
  const key =
    `${base}${suffix}` as keyof (typeof APP_RESPONSE_MESSAGE)[ModelKeys];

  const group = APP_RESPONSE_MESSAGE[model];

  if (typeof group === "object" && group !== null && key in group) {
    return group[key];
  }

  return undefined;
}

export function prismaErrorCode(
  error: unknown,
): { status: number; message: string } | undefined {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError))
    return undefined;
  const raw = error.meta?.modelName as string | undefined;
  if (!raw) return undefined;

  const rawKey = raw === "UserGroups" ? "userGroup" : raw.toLowerCase();
  const modelKey = (Object.keys(APP_RESPONSE_MESSAGE) as ModelKeys[]).find(
    (key) => key === rawKey,
  );
  const isValidKey = modelKey && modelKey in APP_RESPONSE_MESSAGE;

  switch (error.code) {
    case "P2002":
      return {
        status: HTTP_RESPONSE_CODE.CONFLICT,
        message: isValidKey
          ? (getMessage(modelKey, "DoesExist") ??
            APP_RESPONSE_MESSAGE.serverError)
          : APP_RESPONSE_MESSAGE.serverError,
      };

    case "P2025":
      return {
        status: HTTP_RESPONSE_CODE.NOT_FOUND,
        message: isValidKey
          ? (getMessage(modelKey, "DoesntExist") ??
            APP_RESPONSE_MESSAGE.serverError)
          : APP_RESPONSE_MESSAGE.serverError,
      };
    case "P2003":
      return {
        status: HTTP_RESPONSE_CODE.BAD_REQUEST,
        message: "Foreign key constraint failed",
      };

    default:
      return {
        status: HTTP_RESPONSE_CODE.SERVER_ERROR,
        message: APP_RESPONSE_MESSAGE.serverError,
      };
  }
}

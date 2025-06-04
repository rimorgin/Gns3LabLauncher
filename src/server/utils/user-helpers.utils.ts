import {
  Permission,
  Role,
  RoleName,
  RolesCollection,
} from "@srvr/types/auth.type.ts";

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

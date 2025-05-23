import { Permission, Role, RoleName, RolesCollection } from "@srvr/types/auth.type.js";

export function hasPermission(role: Role, permission: Permission): boolean {
  return role.permissions.includes(permission);
}

export function getRolePermissions(roles: RolesCollection, roleName: RoleName): Permission[] {
  const role = roles.roles.find(r => r.name === roleName);
  return role?.permissions ?? [];
}
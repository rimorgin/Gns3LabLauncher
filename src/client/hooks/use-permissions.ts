import { IUser } from "@clnt/lib/store/user-store";
import { useUserStore } from "@clnt/lib/store/user-store";

export const usePermissions = () => {
  const { user } = useUserStore();

  /**
   * Check if user has at least one of the required permissions
   */
  const hasAnyPermission = (
    requiredPermissions: string | string[],
  ): boolean => {
    if (!user || !Array.isArray(user.permissions)) return false;

    const permissionsToCheck = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];

    return permissionsToCheck.some((permission) =>
      user.permissions.includes(permission),
    );
  };

  /**
   * Check if user has all of the required permissions
   */
  const hasAllPermissions = (
    requiredPermissions: string | string[],
  ): boolean => {
    if (!user || !Array.isArray(user.permissions)) return false;

    const permissionsToCheck = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];

    return permissionsToCheck.every((permission) =>
      user.permissions.includes(permission),
    );
  };

  /**
   * Check if user has at least one of the required roles
   */
  const hasAnyRole = (
    requiredRoles: IUser["role"] | IUser["role"][],
  ): boolean => {
    if (!user) return false;

    const rolesToCheck = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];

    return rolesToCheck.includes(user.role);
  };

  return {
    user,
    hasAnyPermission,
    hasAllPermissions,
    hasAnyRole,
  };
};

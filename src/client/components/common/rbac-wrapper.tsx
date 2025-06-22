// components/RBACWrapper.tsx
import { usePermissions } from "@clnt/hooks/use-permissions";
import { IUser } from "@clnt/lib/auth";

interface RBACWrapperProps {
  requiredPermissions?: string | string[];
  requiredRoles?: IUser["role"] | IUser["role"][];
  requireAllPermission?: boolean;
  //fallback?: React.ReactNode;
  children: React.ReactNode;
}

const RBACWrapper = ({
  requiredPermissions,
  requiredRoles,
  requireAllPermission,
  //fallback = <div>You do not have access to this content.</div>,
  children,
}: RBACWrapperProps) => {
  const { hasAllPermissions, hasAnyPermission, hasAnyRole } = usePermissions();

  const hasAnyOrAllPermission = () => {
    if (requiredPermissions && requireAllPermission) {
      return hasAllPermissions(requiredPermissions);
    } else if (requiredPermissions) {
      return hasAnyPermission(requiredPermissions);
    }
  };

  const canAccess =
    (!requiredPermissions || hasAnyOrAllPermission()) &&
    (!requiredRoles || hasAnyRole(requiredRoles));

  // Allow access if either permission or role check passes
  if (canAccess) {
    return <>{children}</>;
  }

  if (!canAccess) {
    return <></>;
  }

  //return <>{fallback}</>;
};

export default RBACWrapper;

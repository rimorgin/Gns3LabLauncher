import { UserGroupList } from "@clnt/components/cards/user-group-cards";
import {
  useUserGroupsByIdsQuery,
  useUserGroupsQuery,
} from "@clnt/lib/queries/user-groups-query";
import { Skeleton } from "@clnt/components/ui/skeleton";
import { useUser } from "@clnt/lib/auth";
import RBACWrapper from "@clnt/components/common/rbac-wrapper";
import { UserGroupDataTable } from "@clnt/components/tables/user-group-data-table";

function RestrictedContent() {
  const {
    data: userGroupQry = [],
    isLoading,
    error,
  } = useUserGroupsQuery({
    includes: ["student", "classroom"],
  });

  return isLoading ? (
    <Skeleton className="h-100 w-auto rounded-xl" />
  ) : error ? (
    <div className="px-4 lg:px-6 content-center">
      <p>Something breaks!...</p>
    </div>
  ) : (
    <UserGroupDataTable data={userGroupQry} />
  );
}

function PublicContent() {
  const user = useUser();
  const userGroupIds = user.data?.student?.userGroups?.map((g) => g.id) ?? [];

  const {
    data: userGroupsQry,
    isLoading,
    error,
  } = useUserGroupsByIdsQuery(userGroupIds);

  return isLoading ? (
    <Skeleton className="h-100 w-auto rounded-xl" />
  ) : error ? (
    <div className="content-center">
      <p>Something breaks!...</p>
    </div>
  ) : (
    <UserGroupList groups={userGroupsQry} />
  );
}

export default function UserGroupsContent() {
  return (
    <>
      <RBACWrapper requiredRoles={["administrator", "instructor"]}>
        <RestrictedContent />
      </RBACWrapper>
      <RBACWrapper requiredRoles={["student"]}>
        <PublicContent />
      </RBACWrapper>
    </>
  );
}

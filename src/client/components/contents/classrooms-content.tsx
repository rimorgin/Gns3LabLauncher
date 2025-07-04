import { useClassroomsQuery } from "@clnt/lib/queries/classrooms-query";
import { ClassroomList } from "../cards/classroom-cards";
import RBACWrapper from "../common/rbac-wrapper";
import { ClassroomDataTable } from "../tables/classroom-data-table";
import { Skeleton } from "../ui/skeleton";

export default function ClassroomsContent() {
  const {
    data: classroomQry = [],
    isLoading,
    error,
  } = useClassroomsQuery({
    includes: ["course", "instructor", "students", "projects"],
  });
  return isLoading ? (
    <Skeleton className="h-100 w-auto rounded-xl" />
  ) : error ? (
    <div className="content-center">
      <p>Something breaks!...</p>
    </div>
  ) : (
    <>
      <RBACWrapper requiredRoles={["instructor", "administrator"]}>
        <ClassroomDataTable data={classroomQry} />
      </RBACWrapper>
      <RBACWrapper requiredRoles={"student"}>
        <ClassroomList classrooms={classroomQry} />
      </RBACWrapper>
    </>
  );
}

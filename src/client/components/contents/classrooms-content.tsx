import { useClassroomsQuery } from "@clnt/lib/queries/classrooms-query";
import { ClassroomList } from "../cards/classroom-cards";
import RBACWrapper from "../common/rbac-wrapper";
import { ClassroomDataTable } from "../tables/classroom-data-table";
import { Skeleton } from "../ui/skeleton";
import { useUser } from "@clnt/lib/auth";

export default function ClassroomsContent() {
  const user = useUser();
  const student = user.data?.student;

  const {
    data: classroomQry = [],
    isLoading,
    error,
  } = useClassroomsQuery({
    ...(student?.classrooms?.length && {
      by_id: student.classrooms.map((cls) => cls.id),
    }),
    includes: ["course", "students", "instructor"],
  });

  if (isLoading) {
    return <Skeleton className="h-100 w-auto rounded-xl" />;
  }

  if (error) {
    return (
      <div className="content-center">
        <p>Something went wrong!...</p>
      </div>
    );
  }
  return (
    <>
      <RBACWrapper requiredRoles={["instructor", "administrator"]}>
        <ClassroomDataTable data={classroomQry} />
      </RBACWrapper>
      <RBACWrapper requiredRoles="student">
        <ClassroomList classrooms={classroomQry} />
      </RBACWrapper>
    </>
  );
}

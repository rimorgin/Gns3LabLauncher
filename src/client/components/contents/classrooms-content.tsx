import { useClassroomsQuery } from "@clnt/lib/queries/classrooms-query";
import { ClassroomList } from "../cards/classroom-cards";
import RBACWrapper from "../common/rbac-wrapper";
import { ClassroomDataTable } from "../tables/classroom-data-table";
import { useUser } from "@clnt/lib/auth";
import { Navigate } from "react-router";
import Loader from "../common/loader";

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
    includes: ["course", "students", "instructor", "projects"],
  });

  if (isLoading) return <Loader />;
  if (error) return <Navigate to={"/errorPage"} />;
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

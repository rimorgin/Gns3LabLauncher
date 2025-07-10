import { useCoursesQuery } from "@clnt/lib/queries/courses-query";
import { Skeleton } from "@clnt/components/ui/skeleton";
import RBACWrapper from "@clnt/components/common/rbac-wrapper";
import { CourseDataTable } from "../tables/course-data-table";

export default function CoursesContent() {
  const {
    data: coursesQry = [],
    isLoading,
    error,
  } = useCoursesQuery({ includes: "classrooms" });
  return isLoading ? (
    <Skeleton className="h-100 w-auto rounded-xl" />
  ) : error ? (
    <div className="content-center">
      <p>Something breaks!...</p>
    </div>
  ) : (
    <RBACWrapper requiredRoles={["instructor", "administrator"]}>
      <CourseDataTable data={coursesQry} />
    </RBACWrapper>
  );
}

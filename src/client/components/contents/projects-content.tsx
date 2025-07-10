import { useProjectsQuery } from "@clnt/lib/queries/projects-query";
import { ProjectList } from "@clnt/components/cards/project-cards";
import { ProjectDataTable } from "@clnt/components/tables/projects-data-table";
import { Skeleton } from "@clnt/components/ui/skeleton";
import RBACWrapper from "@clnt/components/common/rbac-wrapper";

export default function ProjectsContent() {
  const {
    data: projectsQry = [],
    isLoading,
    error,
  } = useProjectsQuery({ includes: ["classrooms", "submissions"] });
  return isLoading ? (
    <Skeleton className="h-100 w-auto rounded-xl" />
  ) : error ? (
    <div className="content-center">
      <p>Something breaks!...</p>
    </div>
  ) : (
    <>
      <RBACWrapper requiredRoles={["instructor", "administrator"]}>
        <ProjectDataTable data={projectsQry} />
      </RBACWrapper>
      <RBACWrapper requiredRoles={"student"}>
        <ProjectList projects={projectsQry} />
      </RBACWrapper>
    </>
  );
}

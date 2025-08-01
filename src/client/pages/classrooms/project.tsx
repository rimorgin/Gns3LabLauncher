import Loader from "@clnt/components/common/loader";
import PageMeta from "@clnt/components/common/page-meta";
import ProjectPage from "@clnt/components/pages/project/project-page";
import { useProjectsQuery } from "@clnt/lib/queries/projects-query";
import { useParams, Navigate } from "react-router";

export default function ProjectPageRoute() {
  const params = useParams();
  const projectId = params.projectId;

  if (!projectId) return <div>no params given</div>;
  const {
    data: projectsQry,
    isLoading,
    isError,
  } = useProjectsQuery({ by_id: projectId, includes: ["labs"] });

  if (isLoading) return <Loader />;
  if (isError || !projectsQry) return <Navigate to={"/errorPage"} />;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <PageMeta title="Project" description="Project viewer page route" />
      <ProjectPage project={projectsQry} />
    </main>
  );
}

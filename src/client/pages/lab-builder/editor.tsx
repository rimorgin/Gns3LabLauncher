import { LabEditor } from "@clnt/components/pages/lab-builder/lab-editor";
import { useLabQuery } from "@clnt/lib/queries/lab-query";
import { NavLink, useParams } from "react-router";
import Loader from "@clnt/components/common/loader";
import { ChevronLeft } from "lucide-react";
import { Button } from "@clnt/components/ui/button";
import PageMeta from "@clnt/components/common/page-meta";

export default function LabEditorPageRoute() {
  const params = useParams();
  const labId = params.labId;

  if (!labId) return <div>no params given</div>;
  const { data: lab, isLoading, isError } = useLabQuery(labId);

  if (isLoading) return <Loader />;
  if (!lab || isError) return <div>no labs found</div>;
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Lab Editor</h1>
          <p className="text-muted-foreground mt-2">
            Edit hands-on lab with step-by-step guidance
          </p>
        </div>
        <NavLink to="/">
          <Button variant="outline" className="flex items-center">
            <ChevronLeft />
            Go back to homepage
          </Button>
        </NavLink>
      </div>
      <LabEditor initialLab={lab} />
      <PageMeta title="Lab Editor" description="Lab editing page" />
    </div>
  );
}

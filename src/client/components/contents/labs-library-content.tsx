import { LabsBrowser } from "@clnt/components/pages/lab/lab-browser";
import { Alert, AlertDescription, AlertTitle } from "@clnt/components/ui/alert";
import { ChevronRight, InfoIcon } from "lucide-react";
import { Button } from "@clnt/components/ui/button";
import { NavLink } from "react-router";
import { useLabsQuery } from "@clnt/lib/queries/lab-query";
import { toast } from "sonner";
import { useDeleteLab } from "@clnt/lib/mutations/lab/lab-delete-mutation";

export default function LabsLibraryContent() {
  const { data: labsQry, isLoading, isError } = useLabsQuery();

  const deleteLab = useDeleteLab();

  const handleDeleteLab = (id: string) => {
    toast.promise(deleteLab.mutateAsync(id), {
      loading: "Deleting lab",
      success: "Deleted lab successfully",
      error: "Error deleting lab",
    });
  };
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Labs</h1>
        <p className="text-muted-foreground">
          Explore hands-on networking labs to practice and enhance your skills
        </p>
      </div>
      <Alert className="-mt-4 mb-5">
        <InfoIcon />
        <AlertTitle>Create labs</AlertTitle>
        <AlertDescription>
          <div className="flex flex-col items-start gap-3">
            <p>
              Labs should be applied to projects. If you still don't have labs
              assigned to your project, create a lab here and apply the lab to
              your project to make the labs accessible to your students.
            </p>
            <NavLink to="lab-builder">
              <Button variant="outline" className="flex items-center">
                Proceed to Lab Builder
                <ChevronRight />
              </Button>
            </NavLink>
          </div>
        </AlertDescription>
      </Alert>
      <LabsBrowser
        labs={labsQry}
        isLoading={isLoading}
        isError={isError}
        onDelete={handleDeleteLab}
      />
    </div>
  );
}

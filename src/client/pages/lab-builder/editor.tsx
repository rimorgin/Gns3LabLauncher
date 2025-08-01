import { LabEditor } from "@clnt/components/pages/lab-builder/lab-editor";
import { useLabQuery } from "@clnt/lib/queries/lab-query";
import { useParams } from "react-router";
import Loader from "@clnt/components/common/loader";
import { ChevronLeft } from "lucide-react";
import { Button } from "@clnt/components/ui/button";
import PageMeta from "@clnt/components/common/page-meta";
import { useLabBuilderStore } from "@clnt/lib/store/lab-builder-store";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@clnt/components/ui/alert-dialog";
import router from "../route-layout";
import { startTransition, useEffect } from "react";
import { Lab } from "@clnt/types/lab";

export default function LabEditorPageRoute() {
  const params = useParams();
  const labId = params.labId;
  const labData = useLabBuilderStore((s) => s.lab);
  const exitBuilderPage = useLabBuilderStore((s) => s.exitBuilderPage);
  const hasEdited = useLabBuilderStore((s) => s.hasEdited);
  const initializeLabFromExisting = useLabBuilderStore(
    (s) => s.initializeLabFromExisting,
  );

  if (!labId) return <div>no params given</div>;

  const {
    data: lab,
    isLoading,
    isError,
  } = useLabQuery(labId, {
    enabled: !hasEdited, // 🧠 skip fetching if already edited
  });

  useEffect(() => {
    if (!hasEdited && lab) {
      initializeLabFromExisting(lab as Lab);
    }
  }, [lab, hasEdited, initializeLabFromExisting]);

  if (isLoading && !labData) return <Loader />;
  if (!lab || isError) return <div>no labs found</div>;

  const handleExit = () => {
    exitBuilderPage();
    startTransition(() => {
      router.navigate("/");
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Lab Editor</h1>
          <p className="text-muted-foreground mt-2">
            Edit hands-on lab with step-by-step guidance
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <ChevronLeft />
              Go back to homepage
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Any unsaved changes will be lost. Do you want to go back to the
                homepage?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleExit}
                className="bg-destructive active:bg-red-800 hover:bg-red-800"
              >
                Yes, go back
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <LabEditor initialLab={labData} />
      <PageMeta title="Lab Editor" description="Lab editing page" />
    </div>
  );
}

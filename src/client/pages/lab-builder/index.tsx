import PageMeta from "@clnt/components/common/page-meta";
import { LabBuilder } from "@clnt/components/pages/lab-builder/lab-builder";
import { Button } from "@clnt/components/ui/button";
import { useLabBuilderStore } from "@clnt/lib/store/lab-builder-store";
import { ChevronLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@clnt/components/ui/alert-dialog";
import { startTransition } from "react";
import router from "../route-layout";

export default function LabBuilderPageRoute() {
  const exitBuilderPage = useLabBuilderStore((s) => s.exitBuilderPage);
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
          <h1 className="text-3xl font-bold">Lab Builder</h1>
          <p className="text-gray-600 mt-2">
            Create comprehensive hands-on labs with step-by-step guidance
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
              <Button onClick={handleExit} variant="destructive">
                Yes, go back
              </Button>
              {/* <AlertDialogAction
                onClick={handleExit}
                className="bg-red-800 hover:bg-red-500  text-white"
              >
                Yes, go back
              </AlertDialogAction> */}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <LabBuilder />
      <PageMeta title="Lab Builder" description="Lab building page" />
    </div>
  );
}

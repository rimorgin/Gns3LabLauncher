import PageMeta from "@clnt/components/common/page-meta";
import { LabBuilder } from "@clnt/components/pages/lab-builder/lab-builder";
import { Button } from "@clnt/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { NavLink } from "react-router";

export default function LabBuilderPageRoute() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Lab Builder</h1>
          <p className="text-gray-600 mt-2">
            Create comprehensive hands-on labs with step-by-step guidance
          </p>
        </div>
        <NavLink to="/">
          <Button variant="outline" className="flex items-center">
            <ChevronLeft />
            Go back to homepage
          </Button>
        </NavLink>
      </div>
      <LabBuilder />
      <PageMeta title="Lab Builder" description="Lab building page" />
    </div>
  );
}

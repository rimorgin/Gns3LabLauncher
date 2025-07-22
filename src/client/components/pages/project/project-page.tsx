import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Badge } from "@clnt/components/ui/badge";
import { Separator } from "@clnt/components/ui/separator";
import CommentsSection from "./comments-section";
import LabCard from "./lab-card"; // Import the new LabCard component
import { Lab } from "@clnt/types/lab";
import moment from "moment";
import router from "@clnt/pages/route-layout";
import { Button } from "@clnt/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router";

// Define a type for the Project based on your Prisma schema
interface Project {
  id: string;
  projectName: string;
  projectDescription?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  visible?: boolean | null;
  duration?: Date | null;
  tags?: string;
  lab?: Lab;
}

interface ProjectPageProps {
  project: Project;
}

export default function ProjectPage({ project }: ProjectPageProps) {
  const { classroomId } = useParams();
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="space-y-4">
          {/* Go Back Button */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => router.navigate(`/classrooms/${classroomId}`)}
              className="-ml-2"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </Button>
            {project.visible === false && (
              <Badge variant="destructive">Hidden</Badge>
            )}
          </div>
          {project.imageUrl && (
            <img
              src={project.imageUrl || "/placeholder.svg"}
              alt={`Image for ${project.projectName}`}
              className="rounded-lg object-cover w-full h-70"
            />
          )}
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold">
              {project.projectName}
            </CardTitle>
            {project.visible === false && (
              <Badge variant="destructive" className="ml-4">
                Hidden
              </Badge>
            )}
          </div>
          <Badge variant="secondary">{project.tags}</Badge>
          <CardDescription className="text-lg text-muted-foreground">
            {project.projectDescription || "No description provided."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Created At:</span>{" "}
              <p>{moment(project.createdAt).format("LLLL")}</p>
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>{" "}
              <p>{moment(project.updatedAt).format("LLLL")}</p>
            </div>
            {project.duration && (
              <div>
                <span className="font-medium">Target Completion:</span>{" "}
                <p>{moment(project.duration).format("LLLL")}</p>
              </div>
            )}
          </div>
          {project.lab && (
            <>
              <Separator />
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Associated Lab</h2>
                <LabCard lab={project.lab} />
              </div>
            </>
          )}
          <Separator />
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Related Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-medium">Progress Updates</h3>
                <p className="text-sm text-muted-foreground">
                  View all progress entries for this project. (Placeholder)
                </p>
              </div>
              <div className="p-4 border rounded-md">
                <h3 className="font-medium">Submissions</h3>
                <p className="text-sm text-muted-foreground">
                  Browse all submissions related to this project. (Placeholder)
                </p>
              </div>
            </div>
          </div>
          <CommentsSection />
        </CardContent>
      </Card>
    </div>
  );
}

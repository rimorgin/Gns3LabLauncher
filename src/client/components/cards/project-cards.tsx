import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Badge } from "@clnt/components/ui/badge";
import { Clock3 } from "lucide-react";
import moment from "moment";
import * as React from "react";
import { Button } from "@clnt/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@clnt/components/ui/drawer";

type ProjectData = {
  id: string;
  projectName: string;
  projectDescription?: string;
  tags?: string;
  imageUrl?: string;
  progress?: number;
  createdAt: string;
  updatedAt: string;
  visible: boolean;
  duration: string | null;
};

export function ProjectCard({ project }: { project: ProjectData }) {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  return (
    <>
      <ProjectViewer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        project={project}
      />
      <Card
        role="button"
        tabIndex={0}
        onClick={() => setOpenDrawer(project.visible)}
        className={`w-full max-w-md rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
          project.visible
            ? "cursor-pointer hover:scale-[1.025] hover:shadow-lg active:scale-95"
            : "mask-b-from-sidebar-primary-foreground opacity-70"
        }`}
      >
        <div className="relative">
          <img
            src={project.imageUrl || "/placeholder.png"}
            alt={project.projectName}
            className="h-40 w-full object-cover rounded-t-xl -mt-6 transition-all duration-300 group-hover:scale-105"
          />
          <Badge
            variant={project.tags === "networking" ? "default" : "destructive"}
            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2"
          >
            <p className="text-amber-50">{project.tags}</p>
          </Badge>
        </div>
        <CardHeader>
          <CardTitle className="text-md font-semibold">
            {project.projectName}
          </CardTitle>
          <CardDescription className="text-xs">
            {project.projectDescription || "No description provided."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            {typeof project.progress === "number" && (
              <div className="w-full bg-muted rounded h-1 mt-2">
                <div
                  className="bg-primary h-1 rounded"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            )}

            {project.duration && (
              <div className="flex items-center gap-2">
                <Clock3 className="w-4 h-4" />
                Duration: {moment(project.duration).format("llll")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export function ProjectList({ projects }: { projects: ProjectData[] }) {
  if (projects.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic py-6 text-center">
        No projects found.
      </div>
    );
  }
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="break-inside-avoid">
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}

export function ProjectViewer({
  project,
  open,
  onOpenChange,
}: {
  project: ProjectData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Drawer modal open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent className="h-1/1">
        <div className="h-full flex flex-col">
          <DrawerHeader>
            <DrawerTitle>{project.projectName}</DrawerTitle>
            <DrawerDescription>{project.projectDescription}</DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4">
            {/* Main content */}
          </div>

          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

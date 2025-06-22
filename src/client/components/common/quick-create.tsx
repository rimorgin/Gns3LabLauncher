import { IconCirclePlusFilled } from "@tabler/icons-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@clnt/components/ui/tabs";
import { ResponsiveDrawerDialog } from "../ui/responsive-dialog";
import { Button } from "@clnt/components/ui/button";
import { UserForm } from "../forms/user-form";
import { ClassroomForm } from "../forms/classroom-form";
import { ProjectForm } from "../forms/project-form";
import { CourseForm } from "../forms/course-form";
import { useState } from "react";
import { useAppStateStore } from "@clnt/lib/store/app-state-store";

export default function QuickCreate() {
  const { isQuickCreateDialogOpen, toggleQuickCreateDialog } = useAppStateStore();

  return (
    <ResponsiveDrawerDialog
      open={isQuickCreateDialogOpen}
      onOpenChange={toggleQuickCreateDialog}
      button={
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground dark:text-white max-w-31 duration-50 ease-linear active:scale-95">
          <IconCirclePlusFilled />
          <span>Quick Create</span>
        </Button>
      }
    >
      <Tabs defaultValue="user" className="w-full -mt-8.5 -ml-2">
        <TabsList className="mb-4">
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="course">Course</TabsTrigger>
          <TabsTrigger value="classroom">Classroom</TabsTrigger>
          <TabsTrigger value="project">Project</TabsTrigger>
        </TabsList>

        <TabsContent value="user">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a user by filling all required forms.
            </p>
            <UserForm />
          </div>
        </TabsContent>
        <TabsContent value="course">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a course by filling all required forms.
            </p>
            <CourseForm />
          </div>
        </TabsContent>
        <TabsContent value="classroom">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a classroom by filling all required forms.
            </p>
            <ClassroomForm />
          </div>
        </TabsContent>
        <TabsContent value="project">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a project by filling all required forms.
            </p>
            <ProjectForm />
          </div>
        </TabsContent>
      </Tabs>
    </ResponsiveDrawerDialog>
  );
}

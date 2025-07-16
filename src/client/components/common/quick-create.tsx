import { IconCirclePlusFilled } from "@tabler/icons-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@clnt/components/ui/tabs";
import { ResponsiveDrawerDialog } from "@clnt/components/ui/responsive-dialog";
import { Button } from "@clnt/components/ui/button";
import { ClassroomCreateForm } from "@clnt/components/forms/classroom/classroom-create-form";
import { ProjectCreateForm } from "@clnt/components/forms/project/project-create-form";
import { CourseCreateForm } from "@clnt/components/forms/course/course-create-form";
import { UserGroupCreateForm } from "@clnt/components/forms/usergroup/user-group-create-form";
import { UserCreateForm } from "@clnt/components/forms/user/user-create-form";
import { useQuickDialogStore } from "@clnt/lib/store/quick-create-dialog-store";
import { useState } from "react";
import { UserBulkCreateForm } from "../forms/user/bulk-user-create-form";
import { Switch } from "../ui/switch";

export default function QuickCreate() {
  const isQuickDialogOpen = useQuickDialogStore(
    (state) => state.isQuickDialogOpen,
  );
  const toggleQuickDialog = useQuickDialogStore(
    (state) => state.toggleQuickDialog,
  );

  const [isBulkUserCreate, setIsBulkUserCreate] = useState(false);

  return (
    <ResponsiveDrawerDialog
      open={isQuickDialogOpen}
      onOpenChange={toggleQuickDialog}
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
          <TabsTrigger value="user-group">User Group</TabsTrigger>
          <TabsTrigger value="course">Course</TabsTrigger>
          <TabsTrigger value="classroom">Classroom</TabsTrigger>
          <TabsTrigger value="project">Project</TabsTrigger>
        </TabsList>

        <TabsContent value="user">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a user by filling all required forms.
            </p>
            <div className="flex items-center mb-4 gap-5">
              <Switch
                onCheckedChange={setIsBulkUserCreate}
                checked={isBulkUserCreate}
              />

              <span className="text-xs font-medium text-foreground">
                {isBulkUserCreate ? "Bulk Create" : "Single Create"}
              </span>
            </div>
            {isBulkUserCreate ? (
              <div className="min-h-fit max-h-[70vh] overflow-auto">
                <UserBulkCreateForm />
              </div>
            ) : (
              <UserCreateForm />
            )}
          </div>
        </TabsContent>
        <TabsContent value="user-group">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a user group by filling all required forms.
            </p>
            <UserGroupCreateForm />
          </div>
        </TabsContent>
        <TabsContent value="course">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a course by filling all required forms.
            </p>
            <CourseCreateForm />
          </div>
        </TabsContent>
        <TabsContent value="classroom">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a classroom by filling all required forms.
            </p>
            <ClassroomCreateForm />
          </div>
        </TabsContent>
        <TabsContent value="project">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a project by filling all required forms.
            </p>
            <ProjectCreateForm />
          </div>
        </TabsContent>
      </Tabs>
    </ResponsiveDrawerDialog>
  );
}

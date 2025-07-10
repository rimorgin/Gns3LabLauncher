import { Button } from "@clnt/components/ui/button";
import { Input } from "@clnt/components/ui/input";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@clnt/components/ui/avatar";
import { ProjectDbData } from "@clnt/lib/validators/projects-schema";
import { useProjectDelete } from "@clnt/lib/mutations/project/project-delete-mutation";
import { useQuickDrawerStore } from "@clnt/lib/store/quick-drawer-store";

interface ProjectDeleteProps {
  initialData: Partial<ProjectDbData> | Array<Partial<ProjectDbData>>;
}

export function ProjectDeleteForm({ initialData }: ProjectDeleteProps) {
  const toggleQuickDrawer = useQuickDrawerStore(
    (state) => state.toggleQuickDrawer,
  );
  const { mutateAsync, status } = useProjectDelete();

  const isArray = Array.isArray(initialData);
  const dataList = isArray ? initialData : [initialData];
  const firstProject = dataList[0]; // Used for showing name/owner/etc

  const onDelete = async () => {
    const ids = dataList
      .map((project) => project.id)
      .filter(Boolean) as string[];

    if (ids.length === 0) {
      toast.error("No project selected for deletion.");
      return;
    }

    toast.promise(mutateAsync(ids), {
      loading: ids.length > 1 ? "Deleting projects..." : "Deleting project...",
      success: () => {
        toggleQuickDrawer();
        return ids.length > 1 ? "Projects deleted." : "Project deleted.";
      },
      error: (err) =>
        err?.response?.data?.message || "Failed to delete project(s)",
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onDelete();
      }}
      className="space-y-4"
    >
      {(!isArray || dataList.length === 1) && (
        <>
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input disabled value={firstProject?.projectName || ""} />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <Input disabled value={firstProject?.projectDescription || ""} />
          </div>

          <div>
            <label className="block text-sm font-medium">Tags</label>
            <Input disabled value={firstProject?.tags || ""} />
          </div>
        </>
      )}

      {isArray && (
        <div>
          {dataList.map((project, index) => (
            <div
              key={project.id || project.projectName}
              className="flex items-center gap-2 py-2 text-md"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {`${index + 1}`}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{project.projectName}</span>
                <span className="text-muted-foreground">
                  {project.projectDescription}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">
          {isArray
            ? `This will permanently delete ${dataList.length} projects and all associated data.`
            : "This will permanently delete this project and all associated data."}
        </p>
      </div>
      <div className="w-full px-4 absolute bottom-17 right-0">
        <Button
          type="submit"
          className="w-full"
          disabled={status === "pending"}
          variant="destructive"
        >
          {status === "pending"
            ? "Deleting..."
            : isArray
              ? "Delete Selected Projects"
              : "Delete Project"}
        </Button>
      </div>
    </form>
  );
}

import { Button } from "@clnt/components/ui/button";
import { Input } from "@clnt/components/ui/input";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@clnt/components/ui/avatar";
import { ClassroomDbData } from "@clnt/lib/validators/classroom-schema";
import { useClassroomDelete } from "@clnt/lib/mutations/classrooms/classroom-delete-mutation";
import { useQuickDrawerStore } from "@clnt/lib/store/quick-drawer-store";

interface ClassroomDeleteProps {
  initialData: Partial<ClassroomDbData> | Array<Partial<ClassroomDbData>>;
}

export function ClassroomDeleteForm({ initialData }: ClassroomDeleteProps) {
  const toggleQuickDrawer = useQuickDrawerStore(
    (state) => state.toggleQuickDrawer,
  );
  const { mutateAsync, status } = useClassroomDelete();

  const isArray = Array.isArray(initialData);
  const dataList = isArray ? initialData : [initialData];
  const firstClassroom = dataList[0]; // Used for showing name/email/username

  const onDelete = async () => {
    const ids = dataList.map((user) => user.id).filter(Boolean) as string[];

    if (ids.length === 0) {
      toast.error("No classroom selected for deletion.");
      return;
    }

    toast.promise(mutateAsync(ids), {
      loading:
        ids.length > 1 ? "Deleting classrooms..." : "Deleting classroom...",
      success: () => {
        toggleQuickDrawer();
        return ids.length > 1 ? "Classrooms deleted." : "Classroom deleted.";
      },
      error: (err) =>
        err?.response?.data?.message || "Failed to delete classroom(s)",
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
            <Input disabled value={firstClassroom?.classroomName || ""} />
          </div>

          <div>
            <label className="block text-sm font-medium">Course Info</label>
            <Input
              disabled
              value={`${firstClassroom.course?.courseCode}-${firstClassroom.course?.courseName}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Instructor</label>
            <Input
              disabled
              value={firstClassroom?.instructor?.user.name || ""}
            />
          </div>
        </>
      )}

      {isArray && (
        <div>
          {dataList.map((classroom, index) => (
            <div
              key={classroom.id || classroom.classroomName}
              className="flex items-center gap-2 py-2 text-md"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {`${index + 1}`}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{classroom.classroomName}</span>
                <span className="text-muted-foreground">{`${classroom.course?.courseCode}-${classroom.course?.courseName}`}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">
          {isArray
            ? `This will permanently delete ${dataList.length} classrooms and all associated data.`
            : "This will permanently delete this classroom and all associated data."}
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
              ? "Delete Selected Classrooms"
              : "Delete Classroom"}
        </Button>
      </div>
    </form>
  );
}

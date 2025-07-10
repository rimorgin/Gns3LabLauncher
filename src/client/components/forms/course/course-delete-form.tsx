import { Button } from "@clnt/components/ui/button";
import { Input } from "@clnt/components/ui/input";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@clnt/components/ui/avatar";
import { useQuickDrawerStore } from "@clnt/lib/store/quick-drawer-store";
import { CourseDbData } from "@clnt/lib/validators/course-schema";
import { useCourseDelete } from "@clnt/lib/mutations/course/course-delete-mutation";

interface CourseDeleteProps {
  initialData: Partial<CourseDbData> | Array<Partial<CourseDbData>>;
}

export function CourseDeleteForm({ initialData }: CourseDeleteProps) {
  const toggleQuickDrawer = useQuickDrawerStore(
    (state) => state.toggleQuickDrawer,
  );
  const { mutateAsync, status } = useCourseDelete();

  const isArray = Array.isArray(initialData);
  const dataList = isArray ? initialData : [initialData];
  const firstCourse = dataList[0];

  const onDelete = async () => {
    const ids = dataList
      .map((project) => project.id)
      .filter(Boolean) as string[];

    if (ids.length === 0) {
      toast.error("No project selected for deletion.");
      return;
    }

    toast.promise(mutateAsync(ids), {
      loading: ids.length > 1 ? "Deleting courses..." : "Deleting course...",
      success: () => {
        toggleQuickDrawer();
        return ids.length > 1 ? "Courses deleted." : "Course deleted.";
      },
      error: (err) =>
        err?.response?.data?.message || "Failed to delete course(s)",
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
            <label className="block text-sm font-medium">Course Code</label>
            <Input disabled value={firstCourse?.courseCode || ""} />
          </div>

          <div>
            <label className="block text-sm font-medium">Course Name</label>
            <Input disabled value={firstCourse?.courseName || ""} />
          </div>
        </>
      )}

      {isArray && (
        <div>
          {dataList.map((course, index) => (
            <div
              key={course.id}
              className="flex items-center gap-2 py-2 text-md"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {`${index + 1}`}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{course.courseName}</span>
                <span className="text-muted-foreground">
                  {course.courseCode}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">
          {isArray
            ? `This will permanently delete ${dataList.length} courses and all associated data.`
            : "This will permanently delete this course and all associated data."}
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
              ? "Delete Selected Courses"
              : "Delete Course"}
        </Button>
      </div>
    </form>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  courseFormSchema,
  CourseFormData,
  CourseDbData,
} from "@clnt/lib/validators/course-schema";
import { Input } from "@clnt/components/ui/input";
import { Button } from "@clnt/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@clnt/components/ui/form";
import { useCoursePatch } from "@clnt/lib/mutations/course/course-update-mutation";
import { toast } from "sonner";
import { useClassroomsQuery } from "@clnt/lib/queries/classrooms-query";
import { Skeleton } from "@clnt/components/ui/skeleton.tsx";
import { MultiSelect } from "@clnt/components/ui/multi-select.tsx";
import { safeIds } from "@clnt/lib/utils";
import { deepEqual } from "fast-equals";
import { useQuickDrawerStore } from "@clnt/lib/store/quick-drawer-store";

interface CourseEditProps {
  initialData?: Partial<CourseDbData>;
}

export function CourseUpdateForm({ initialData }: CourseEditProps) {
  const toggleQuickDrawer = useQuickDrawerStore(
    (state) => state.toggleQuickDrawer,
  );
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      courseCode: initialData?.courseCode || "",
      courseName: initialData?.courseName || "",
      classroomIds: safeIds(initialData?.classrooms?.map((c) => c.id)),
    },
  });

  const {
    data: classroomQry = [],
    isLoading: isClassroomsLoading,
    error: errorOnClassrooms,
  } = useClassroomsQuery({ includes: ["courseId"] });

  const { mutateAsync, status } = useCoursePatch();

  const onSubmit = async (data: CourseFormData) => {
    if (!initialData?.id) {
      toast.error("Course ID is required for updating.");
      return;
    }

    const defaultData = form.formState.defaultValues ?? {};
    // Build payload, only if changed
    const payload: CourseFormData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => {
        const prev = (defaultData as Record<string, unknown>)[key];
        return !deepEqual(prev, value) && value !== undefined && value !== "";
      }),
    ) as CourseFormData;

    if (Object.keys(payload).length === 0) {
      toast.error(
        "No changes detected. Please modify the form before submitting.",
      );
      return;
    }

    toast.promise(mutateAsync({ id: initialData.id, data: payload }), {
      loading: "Updating course...",
      success: (message) => {
        form.reset();
        toggleQuickDrawer();
        return message;
      },
      error: (error) => error.response?.data?.message || "Failed to update",
    });
  };

  if (isClassroomsLoading)
    return (
      <>
        <Skeleton className="w-18 h-4" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-18 h-4" />
        <Skeleton className="w-full h-8" />
      </>
    );
  if (errorOnClassrooms) return <div>Failed to load resources</div>;

  const classroomOptions = classroomQry?.map(
    (cls: { id: string; classroomName: string; status: string }) => ({
      value: cls.id,
      label: `${cls.classroomName} (${cls.status})`,
    }),
  );

  return (
    <Form {...form}>
      <form
        //onSubmit={form.handleSubmit((data) => createCourse.mutate(data))}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="courseCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g. IT186-8L" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="courseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Advance Computer Networking 1"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classroomIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel optional>Select Available Classrooms</FormLabel>
              <FormControl>
                <MultiSelect
                  options={classroomOptions}
                  value={(field.value ?? []).filter(Boolean) as string[]}
                  onValueChange={field.onChange}
                  placeholder="Select Classrooms"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full px-4 absolute bottom-17 right-0">
          <Button type="submit" className="w-full">
            {status === "pending" ? "Updating Course..." : "Update Course"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  courseFormSchema,
  CourseFormData,
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
import { useCoursesPost } from "@clnt/lib/mutations/courses-mutation";
import { toast } from "sonner";
import { useAppStateStore } from "@clnt/lib/store/app-state-store";
import { useClassroomsQuery } from "@clnt/lib/queries/classrooms-query";
import { Skeleton } from "../ui/skeleton";
import { MultiSelect } from "../ui/multi-select";

export function CourseForm() {
  const { toggleQuickCreateDialog } = useAppStateStore();
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      courseCode: "",
      courseName: "",
      classroomIds: []
    },
  });

    const {
      data: classroomQry = [],
      isLoading: isClassroomsLoading,
      error: errorOnClassrooms,
      // EMBED DATA with boolean option TRUE
    } = useClassroomsQuery({includes: ["courseId"]});

  const { mutateAsync, status } = useCoursesPost();

  const onSubmit = async (data: CourseFormData) => {
    toast.promise(mutateAsync(data), {
      loading: "Creating course...",
      success: (message) => {
        form.reset();
        toggleQuickCreateDialog(); // Close dialog
        return message;
      },
      error: (error) => error.response.data.message,
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

    const classroomOptions = classroomQry
      ?.filter((cls: { courseId?: string }) => !cls.courseId)
      .map(
        (cls: {
          id: string;
          classroomName: string;
          status: string;
        }) => ({
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
              <FormLabel>
                Select Classes{" "}
                <span className="text-muted-foreground">{"(optional)"}</span>
              </FormLabel>
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

        <Button type="submit" className="w-full">
          {status === "pending" ? "Creating Course..." : "Create Course"}
        </Button>
      </form>
    </Form>
  );
}

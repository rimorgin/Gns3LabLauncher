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
import { useCoursesPost } from "@clnt/lib/query/course-query";
import { toast } from "sonner";
import { useAppStateStore } from "@clnt/lib/store/app-state-store";

export function CourseForm() {
  const { toggleQuickCreateDialog } = useAppStateStore();
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      courseCode: "",
      courseName: "",
    },
  });

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

        <Button type="submit" className="w-full">
          {status === "pending" ? "Creating Course..." : "Create Course"}
        </Button>
      </form>
    </Form>
  );
}

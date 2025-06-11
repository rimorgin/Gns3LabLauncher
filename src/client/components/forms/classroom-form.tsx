// src/components/forms/ClassroomForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  classroomFormSchema,
  ClassroomFormData,
} from "@clnt/lib/validators/classroom-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@clnt/components/ui/form";
import { Input } from "@clnt/components/ui/input";
import { Button } from "@clnt/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@clnt/components/ui/select";
import { useCoursesQuery } from "@clnt/lib/query/course-query";
import { useClassroomsPost } from "@clnt/lib/query/classroom-query";
import { toast } from "sonner";
import { useUserInstructorsQuery } from "@clnt/lib/query/user-query";
import { useAppStateStore } from "@clnt/lib/store/app-state-store";

export function ClassroomForm() {
  const { toggleQuickCreateDialog } = useAppStateStore();
  const form = useForm<ClassroomFormData>({
    resolver: zodResolver(classroomFormSchema),
    defaultValues: {
      courseid: "",
      classname: "",
      instructor: "",
      status: "active",
    },
  });

  const {
    data: coursesQry = [],
    isLoading: isCoursesLoading,
    error: errorOnCourses,
  } = useCoursesQuery();
  const {
    data: userInstructorQry = [],
    isLoading: isUserInstructorLoading,
    error: errorOnUserInstructor,
  } = useUserInstructorsQuery();
  const { mutateAsync, status } = useClassroomsPost();

  const onSubmit = async (data: ClassroomFormData) => {
    toast.promise(mutateAsync(data), {
      loading: "Creating classroom...",
      success: (message) => {
        form.reset();
        toggleQuickCreateDialog(); // Close dialog
        return message;
      },
      error: (error) => error.response.data.message,
    });
  };

  if (isCoursesLoading && isUserInstructorLoading) return <div>Loading courses…</div>;
  if (errorOnCourses && errorOnUserInstructor) return <div>Failed to load courses</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="courseid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign to Course</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="e.g. IT186-8L" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Courses</SelectLabel>
                    {coursesQry.map(
                      (cls: {
                        _id: string;
                        coursecode: string;
                        coursename: string;
                      }) => (
                        <SelectItem key={cls._id} value={cls._id}>
                          {cls.coursecode}-{cls.coursename}
                        </SelectItem>
                      ),
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. AM1 1st Semester 2023-2024"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instructor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Class Instructor
                <span className="text-muted-foreground">{"(optional)"}</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="e.g. Eric Blancaflor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Instructors</SelectLabel>
                    {userInstructorQry.map(
                      (usr: { _id: string; name: string }) => (
                        <SelectItem key={usr._id} value={usr._id}>
                          {usr.name}
                        </SelectItem>
                      ),
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="instructor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign to Course</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="e.g. IT186-8L" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Courses</SelectLabel>
                    {userInstructorQry.map(
                      (cls: {
                        _id: string;
                        coursecode: string;
                        coursename: string;
                      }) => (
                        <SelectItem key={cls._id} value={cls._id}>
                          {cls.coursecode}-{cls.coursename}
                        </SelectItem>
                      ),
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {status === "pending" ? "Creating Classroom..." : "Create Classroom"}
        </Button>
      </form>
    </Form>
  );
}

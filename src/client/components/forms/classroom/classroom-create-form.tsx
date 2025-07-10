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
import { useCoursesQuery } from "@clnt/lib/queries/courses-query";
import { toast } from "sonner";
import { useUsersByRoleQuery } from "@clnt/lib/queries/user-query";
import { useClassroomsPost } from "@clnt/lib/mutations/classrooms/classroom-create-mutation";
import { MultiSelect } from "@clnt/components/ui/multi-select";
import { Skeleton } from "@clnt/components/ui/skeleton";
import { getRandomImage } from "@clnt/lib/utils";
import { useQuickDialogStore } from "@clnt/lib/store/quick-create-dialog-store";

export function ClassroomCreateForm() {
  const toggleQuickDialog = useQuickDialogStore(
    (state) => state.toggleQuickDialog,
  );
  const form = useForm<ClassroomFormData>({
    resolver: zodResolver(classroomFormSchema),
    defaultValues: {
      courseId: "",
      classroomName: "",
      instructorId: "",
      status: undefined,
      studentIds: [],
    },
  });

  const {
    data: coursesQry = [],
    isLoading: isCoursesLoading,
    error: errorOnCourses,
  } = useCoursesQuery({});

  const {
    data: userStudentsQry = [],
    isLoading: isUserStudentsLoading,
    error: errorOnUserStudents,
  } = useUsersByRoleQuery({ role: "student" });

  const {
    data: userInstructorQry = [],
    isLoading: isUserInstructorLoading,
    error: errorOnUserInstructor,
  } = useUsersByRoleQuery({ role: "instructor" });
  const { mutateAsync, status } = useClassroomsPost();

  const onSubmit = async (data: ClassroomFormData) => {
    //console.log("🚀 ~ onSubmit ~ data:", data);
    toast.promise(mutateAsync(data), {
      loading: "Creating classroom...",
      success: (message) => {
        form.reset();
        toggleQuickDialog(); // Close dialog
        return message;
      },
      error: (error) => error.response.data.message,
    });
  };

  if (isCoursesLoading && isUserStudentsLoading && isUserInstructorLoading)
    return (
      <>
        <Skeleton className="w-18 h-4" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-18 h-4" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-18 h-4" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-18 h-4" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-18 h-4" />
        <Skeleton className="w-full h-8" />
      </>
    );

  if (errorOnCourses && errorOnUserStudents && errorOnUserInstructor)
    return <div>Failed to load courses</div>;

  const studentOptions = userStudentsQry.map(
    (student: { id: string; name: string }) => ({
      value: student.id,
      label: student.name,
    }),
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="classroomName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Classroom Name</FormLabel>
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
          name="instructorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Instructor</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger
                    className="w-full"
                    value={field.value}
                    onReset={() => form.resetField("instructorId")}
                  >
                    <SelectValue placeholder="e.g. Eric Blancaflor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Instructors</SelectLabel>
                    {userInstructorQry.map(
                      (usr: { id: string; name: string }) => (
                        <SelectItem key={usr.id} value={usr.id}>
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
        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel optional>Assign to Course</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger
                    className="w-full"
                    value={field.value}
                    onReset={() => form.resetField("courseId")}
                  >
                    <SelectValue placeholder="e.g. IT186-8L" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Courses</SelectLabel>
                    {coursesQry.map(
                      (cls: {
                        id: string;
                        courseCode: string;
                        courseName: string;
                      }) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.courseCode}-{cls.courseName}
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
          name="studentIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel optional>Assign to Students</FormLabel>
              <FormControl>
                <MultiSelect
                  options={studentOptions}
                  value={(field.value ?? []).filter(Boolean) as string[]}
                  onValueChange={field.onChange}
                  placeholder="Select Students"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              {/* allow fallback for reset */}
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger
                    value={field.value}
                    onReset={() => form.resetField("status")}
                  >
                    <SelectValue placeholder="Select Classroom Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Statuses</SelectLabel>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="archived">Archive</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Set imageUrl programmatically with hidden input */}
        <input
          type="hidden"
          {...form.register("imageUrl")}
          value={getRandomImage("classrooms")}
        />

        <Button type="submit" className="w-full">
          {status === "pending" ? "Creating Classroom..." : "Create Classroom"}
        </Button>
      </form>
    </Form>
  );
}

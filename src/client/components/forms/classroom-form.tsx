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
import { useAppStateStore } from "@clnt/lib/store/app-state-store";
import { useProjectsQuery } from "@clnt/lib/queries/projects-query";
import { useClassroomsPost } from "@clnt/lib/mutations/classrooms-mutation";
import { MultiSelect } from "../ui/multi-select";
import { Skeleton } from "../ui/skeleton";

export function ClassroomForm() {
  const { toggleQuickCreateDialog } = useAppStateStore();
  const form = useForm<ClassroomFormData>({
    resolver: zodResolver(classroomFormSchema),
    defaultValues: {
      courseId: "",
      classroomName: "",
      instructorId: "",
      status: "active",
      studentIds: [],
      projectIds: [],
    },
  });

  const {
    data: coursesQry = [],
    isLoading: isCoursesLoading,
    error: errorOnCourses,
  } = useCoursesQuery();

  const {
    data: projectsQry = [],
    isLoading: isProjectsLoading,
    error: errorOnProjects,
  } = useProjectsQuery({});

  const {
    data: userStudentsQry = [],
    isLoading: isUserStudentsLoading,
    error: errorOnUserStudents,
  } = useUsersByRoleQuery({role:"student"});

  const {
    data: userInstructorQry = [],
    isLoading: isUserInstructorLoading,
    error: errorOnUserInstructor,
  } = useUsersByRoleQuery({role:"instructor"});
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

  if (
    isCoursesLoading &&
    isProjectsLoading &&
    isUserStudentsLoading &&
    isUserInstructorLoading
  )
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

  if (
    errorOnCourses &&
    errorOnUserStudents && 
    errorOnUserInstructor &&
    errorOnProjects
  )
    return <div>Failed to load courses</div>;

  const projectOptions = projectsQry.map(
    (prjt: {id: string, projectName: string}) => ({
      value: prjt.id,
      label: prjt.projectName
    }))

  const studentOptions = userStudentsQry.map(
    (student: {id: string, name: string}) => ({
      value: student.id,
      label: student.name
    }))

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
              <FormLabel>
                Assign to Course
                <span className="text-muted-foreground">{"(optional)"}</span>
              </FormLabel>
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
              <FormLabel>
                Assign Students
                <span className="text-muted-foreground">{"(optional)"}</span>
              </FormLabel>
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
          name="projectIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Assign Projects
                <span className="text-muted-foreground">{"(optional)"}</span>
              </FormLabel>
              <FormControl>
                <MultiSelect
                  options={projectOptions}
                  value={(field.value ?? []).filter(Boolean) as string[]}
                  onValueChange={field.onChange}
                  placeholder="Select Projects"
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

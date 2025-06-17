import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  projectFormSchema,
  ProjectFormData,
} from "@clnt/lib/validators/projects-schema";
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
import { Switch } from "../ui/switch";
import { useClassroomsQuery } from "@clnt/lib/query/classroom-query";
import { MultiSelect } from "../ui/multi-select";
import { useProjectsPost } from "@clnt/lib/query/projects-query";
import { toast } from "sonner";
import { useAppStateStore } from "@clnt/lib/store/app-state-store";

export function ProjectForm() { 
  const { toggleQuickCreateDialog } = useAppStateStore();
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      projectName: "",
      projectDescription: "",
      visible: true,
      classroomIds: [],
    },
  });

  const {
    data: classesQry = [],
    isLoading: isClassroomsLoading,
    error: errorOnClassrooms,
  } = useClassroomsQuery(true);
  const { mutateAsync, status } = useProjectsPost();

  const onSubmit = async (data: ProjectFormData) => {
    toast.promise(mutateAsync(data), {
      loading: "Creating Project...",
      success: (message) => {
        console.log("Success:", message);
        form.reset();
        toggleQuickCreateDialog(); // Close dialog
        return message;
      },
      error: (error) => error.response.data.message,
    });
  };

  if (isClassroomsLoading) return <div>Loading…</div>;
  if (errorOnClassrooms) return <div>Failed to load resources</div>;

  const classOptions =
    classesQry?.map(
      (cls: {
        _id: string;
        classroomName: string;
        status: string;
        courseId?: { courseCode: string };
      }) => ({
        value: cls._id,
        label: `${cls.courseId ? `${cls.courseId.courseCode}` : ""} ${cls.classroomName} (${cls.status})`,
      }),
    ) ?? [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Configuring OSPF Inter-Area Lab"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Learn how to configure OSPF inter-area "
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Make Project Visible?</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
                  options={classOptions}
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
          {status === "pending" ? "Creating Project..." : "Create Project"}
        </Button>
      </form>
    </Form>
  );
}

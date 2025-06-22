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
import { useClassroomsQuery } from "@clnt/lib/queries/classrooms-query";
import { MultiSelect } from "../ui/multi-select";
import { useProjectsPost } from "@clnt/lib/mutations/projects-mutation";
import { toast } from "sonner";
import { useAppStateStore } from "@clnt/lib/store/app-state-store";
import { Skeleton } from "../ui/skeleton";

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
    data: classroomsQry = [],
    isLoading: isClassroomsLoading,
    error: errorOnClassrooms,
  } = useClassroomsQuery({includes:['course']});
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

  if (isClassroomsLoading) 
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
      </>
    );
  if (errorOnClassrooms) return <div>Failed to load resources</div>;

  const classroomOptions = classroomsQry?.map(
    (cls: {
      id: string;
      classroomName: string;
      status: string;
      course?: { id: string; courseCode: string };
    }) => ({
      value: cls.id,
      label: `${cls.course?.id ? `${cls.course?.courseCode}` : ""} ${cls.classroomName} (${cls.status})`,
    }),
  );

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
          {status === "pending" ? "Creating Project..." : "Create Project"}
        </Button>
      </form>
    </Form>
  );
}

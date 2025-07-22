import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  projectFormSchema,
  ProjectFormData,
} from "@clnt/lib/validators/projects-schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@clnt/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@clnt/components/ui/select";
import { Input } from "@clnt/components/ui/input";
import { Button } from "@clnt/components/ui/button";
import { Switch } from "@clnt/components/ui/switch";
import { useClassroomsQuery } from "@clnt/lib/queries/classrooms-query";
import { MultiSelect } from "@clnt/components/ui/multi-select";
import { useProjectsPost } from "@clnt/lib/mutations/project/project-create-mutation";
import { toast } from "sonner";
import { Skeleton } from "@clnt/components/ui/skeleton";
import { DateTimePicker } from "@clnt/components/ui/date-time-picker";
import { useState } from "react";
import { useQuickDialogStore } from "@clnt/lib/store/quick-create-dialog-store";
import { Textarea } from "@clnt/components/ui/textarea";
import { useLabsQuery } from "@clnt/lib/queries/lab-query";
import router from "@clnt/pages/route-layout";

export function ProjectCreateForm() {
  const toggleQuickDialog = useQuickDialogStore(
    (state) => state.toggleQuickDialog,
  );
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      projectName: "",
      projectDescription: "",
      visible: true,
      classroomIds: undefined,
      tags: undefined,
      labId: "",
      byGroupSubmissions: false,
    },
  });
  const [isProjectDurationEnabled, setIsProjectDurationEnabled] =
    useState(false);

  const {
    data: classroomsQry = [],
    isLoading: isClassroomsLoading,
    error: errorOnClassrooms,
  } = useClassroomsQuery({ includes: ["course"] });
  const {
    data: labsQry = [],
    isLoading: isLabsLoading,
    error: errorOnLabs,
  } = useLabsQuery();
  const { mutateAsync, status } = useProjectsPost();

  const onSubmit = async (data: ProjectFormData) => {
    //console.log("🚀 ~ onSubmit ~ data:", data);
    toast.promise(mutateAsync(data), {
      loading: "Creating Project...",
      success: (message) => {
        //console.log("Success:", message);
        form.reset();
        toggleQuickDialog(); // Close dialog
        return message;
      },
      error: (error) => error.response.data.message,
    });
  };

  if (isClassroomsLoading || isLabsLoading)
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
  if (errorOnClassrooms || errorOnLabs) return router.navigate("/error");

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

  const labOptions =
    labsQry.length > 0
      ? labsQry
          .filter(
            (lab) => lab.status !== undefined && lab.status === "PUBLISHED",
          )
          .map((lab) => ({
            value: lab.id,
            label: lab.title,
          }))
      : [];

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
                <Textarea
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
              <FormLabel optional>Make Project Visible?</FormLabel>
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
              <FormLabel>Select Classrooms</FormLabel>
              <FormControl>
                <MultiSelect
                  options={classroomOptions}
                  value={(field.value ?? []).filter(Boolean) as string[]}
                  onValueChange={field.onChange}
                  placeholder="Select Classrooms"
                  className="w-full"
                  disabled={!form.getValues("labId")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="labId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Labs</FormLabel>
              {/* allow fallback for reset */}
              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    className="w-full"
                    value={field.value}
                    onReset={() => form.resetField("labId")}
                  >
                    <SelectValue placeholder="e.g. Basic OSPF Configuration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Project Tags</SelectLabel>
                    {labOptions.map((lab, index) => (
                      <SelectItem id={lab.label + index} value={lab.value}>
                        {lab.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Tag</FormLabel>
              {/* allow fallback for reset */}
              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    className="w-full"
                    value={field.value}
                    onReset={() => form.resetField("tags")}
                  >
                    <SelectValue placeholder="e.g. Networking" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Project Tags</SelectLabel>
                    <SelectItem id="networking" value="networking">
                      Networking
                    </SelectItem>
                    <SelectItem id="cybersecurity" value="cybersecurity">
                      Cybersecurity
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="byGroupSubmissions" // adjust this to your schema
          render={({ field }) => (
            <FormItem>
              <FormLabel optional>By Group</FormLabel>
              <FormDescription className="text-xs">
                OFF: Individual / ON: By Group
              </FormDescription>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration" // adjust this to your schema
          render={({ field }) => (
            <FormItem>
              <FormLabel optional>Project Duration</FormLabel>
              <FormDescription className="text-xs">
                {isProjectDurationEnabled
                  ? `Project duration is on. Will expire at ${form.getValues("duration")}`
                  : "Project duration is off. No expiration, unlimited time."}
              </FormDescription>
              <Switch
                checked={isProjectDurationEnabled}
                onCheckedChange={setIsProjectDurationEnabled}
              />
              {isProjectDurationEnabled && (
                <FormControl>
                  <DateTimePicker
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                  />
                </FormControl>
              )}
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

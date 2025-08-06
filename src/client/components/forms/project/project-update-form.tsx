import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  projectFormSchema,
  ProjectFormData,
  ProjectDbData,
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
import { useProjectPatch } from "@clnt/lib/mutations/project/project-update-mutation";
import { toast } from "sonner";
import { Skeleton } from "@clnt/components/ui/skeleton";
import { DateTimePicker } from "@clnt/components/ui/date-time-picker";
import { useEffect, useState } from "react";
import { deepEqual, safeIds } from "@clnt/lib/utils";
import { useLabsQuery } from "@clnt/lib/queries/lab-query";
import { Textarea } from "@clnt/components/ui/textarea";

interface ProjectEditProps {
  initialData?: Partial<ProjectDbData>;
}

export function ProjectUpdateForm({ initialData }: ProjectEditProps) {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      projectName: initialData?.projectName || "",
      projectDescription: initialData?.projectDescription || "",
      visible: initialData?.visible || false,
      tags:
        initialData?.tags === "networking" ||
        initialData?.tags === "cybersecurity"
          ? initialData.tags
          : "networking",
      ...(initialData?.classrooms && {
        classroomIds: safeIds(initialData?.classrooms?.map((c) => c.id)),
      }),
      ...(initialData?.labId && { labId: initialData.labId }),
      duration: initialData?.duration
        ? new Date(initialData.duration)
        : undefined,
      labId: initialData?.labId,
    },
  });
  const [isProjectDurationEnabled, setIsProjectDurationEnabled] =
    useState<boolean>(initialData?.duration ? true : false);

  useEffect(() => {
    if (!isProjectDurationEnabled) {
      //console.log("this fired");
      form.setValue("duration", null);
    }
  }, [isProjectDurationEnabled]);

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
  const { mutateAsync, status } = useProjectPatch();

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (!initialData?.id) {
        toast.error("Project ID is missing. Cannot update user.");
        return;
      }
      const defaultData = form.formState.defaultValues ?? {};
      // Build payload, only if changed
      const payload: ProjectFormData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
          const prev = (defaultData as Record<string, unknown>)[key];
          return !deepEqual(prev, value) && value !== undefined && value !== "";
        }),
      ) as ProjectFormData;

      if (Object.keys(payload).length === 0) {
        return toast.info("Aborting... You have not made any changes at all");
      }
      //console.log("🚀 ~ handleUpdate ~ payload:", payload);

      toast.promise(mutateAsync({ id: initialData.id, data: payload }), {
        loading: "Updating project...",
        success: (message) => {
          form.reset();
          return message;
        },
        error: (err) =>
          err?.response?.data?.message || "Failed to update project",
      });
      return;
    } catch (error) {
      console.error("Error updating user:", error);
    }
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
  if (errorOnClassrooms || errorOnLabs)
    return <div>Failed to load resources</div>;

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
              <FormLabel optional>Select Classrooms</FormLabel>
              <FormControl>
                <MultiSelect
                  options={classroomOptions}
                  defaultValue={form.getValues().classroomIds}
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

        <div className="w-full px-4 absolute bottom-17 right-0">
          <Button type="submit" className="w-full">
            {status === "pending" ? "Updating Project..." : "Update Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

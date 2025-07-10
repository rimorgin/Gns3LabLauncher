import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "sonner";
import { Skeleton } from "@clnt/components/ui/skeleton";
import { MultiSelect } from "@clnt/components/ui/multi-select";
import {
  UserGroupDbData,
  UserGroupFormData,
  userGroupFormSchema,
} from "@clnt/lib/validators/user-group-schema";
import { useUsersByRoleQuery } from "@clnt/lib/queries/user-query";
import { useClassroomsQuery } from "@clnt/lib/queries/classrooms-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@clnt/components/ui/select";
import { StudentOption, StudentWithGroups } from "@clnt/types/student-types";
import { deepEqual, safeIds } from "@clnt/lib/utils";
import { useUserGroupPatch } from "@clnt/lib/mutations/usergroup/user-group-update-mutation";
import { useQuickDrawerStore } from "@clnt/lib/store/quick-drawer-store";

interface UserGroupEditProps {
  initialData: Partial<UserGroupDbData>;
}

export function UserGroupUpdateForm({ initialData }: UserGroupEditProps) {
  const toggleQuickDrawer = useQuickDrawerStore(
    (state) => state.toggleQuickDrawer,
  );
  const form = useForm<UserGroupFormData>({
    resolver: zodResolver(userGroupFormSchema),
    defaultValues: {
      groupName: initialData?.groupName || "",
      classroomId: initialData?.classrooms?.id,
      studentIds: safeIds(initialData?.student?.map((c) => c.userId)),
      limit: initialData?.limit ?? 5,
    },
  });

  const {
    data: userStudentsQry = [],
    isLoading: isUserStudentsLoading,
    error: errorOnUserStudents,
  } = useUsersByRoleQuery({
    includeRoleData: true,
    includeRoleRelations: true,
    role: "student",
  });
  const {
    data: classroomsQry = [],
    isLoading: isClassroomsLoading,
    error: errorOnClassrooms,
  } = useClassroomsQuery({ includes: ["course"] });

  const { mutateAsync, status } = useUserGroupPatch();

  const onSubmit = async (data: UserGroupFormData) => {
    try {
      if (!initialData?.id) {
        toast.error("UserGroup ID is missing. Cannot update user.");
        return;
      }
      const defaultData = form.formState.defaultValues ?? {};
      // Build payload, only if changed
      const payload: UserGroupFormData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
          const prev = (defaultData as Record<string, unknown>)[key];
          return !deepEqual(prev, value) && value !== undefined && value !== "";
        }),
      ) as UserGroupFormData;

      if (Object.keys(payload).length === 0) {
        return toast.info("Aborting... You have not made any changes at all");
      }
      //console.log("🚀 ~ handleUpdate ~ payload:", payload);

      toast.promise(mutateAsync({ id: initialData.id, data: payload }), {
        loading: "Updating user group...",
        success: (message) => {
          form.reset();
          toggleQuickDrawer();
          return message;
        },
        error: (err) =>
          err?.response?.data?.message || "Failed to update user group",
      });
      return;
    } catch (error) {
      console.error("Error updating user group:", error);
    }
  };

  if (isUserStudentsLoading && isClassroomsLoading)
    return (
      <>
        <Skeleton className="w-18 h-4" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-18 h-4" />
        <Skeleton className="w-full h-8" />
      </>
    );
  if (errorOnUserStudents && errorOnClassrooms)
    return <div>Failed to load resources</div>;

  const studentOptions: StudentOption[] = (
    userStudentsQry as StudentWithGroups[]
  ).map((student: StudentWithGroups) => ({
    value: student.id,
    label: student.name,
  }));

  return (
    <Form {...form}>
      <form
        //onSubmit={form.handleSubmit((data) => createCourse.mutate(data))}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="groupName"
          render={({ field }) => (
            <FormItem>
              <FormLabel optional>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Gns3 Lab Group" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classroomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign this Group to Classroom</FormLabel>
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
                    defaultValue={form.getValues("classroomId")}
                    onReset={() => form.resetField("classroomId")}
                  >
                    <SelectValue placeholder="e.g. AM1" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Classrooms</SelectLabel>
                    {classroomsQry.map(
                      (cls: {
                        id: string;
                        classroomName: string;
                        status: string;
                        course?: { id: string; courseCode: string };
                      }) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {`${cls.course?.id ? `${cls.course?.courseCode}` : ""} ${cls.classroomName} (${cls.status})`}
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
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel optional>Group Limit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 5"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="studentIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel optional>Select Students</FormLabel>
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
        <div className="w-full px-4 absolute bottom-17 right-0">
          <Button type="submit" className="w-full">
            {status === "pending"
              ? "Updating User Group..."
              : "Update User Group"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

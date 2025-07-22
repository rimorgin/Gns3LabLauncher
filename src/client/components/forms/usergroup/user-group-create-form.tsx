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
  UserGroupFormData,
  userGroupFormSchema,
} from "@clnt/lib/validators/user-group-schema";
import { useUsersByRoleQuery } from "@clnt/lib/queries/user-query";
import { useUserGroupPost } from "@clnt/lib/mutations/usergroup/user-group-create-mutation";
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
import {
  StudentOption,
  StudentWithGroups,
  UserGroup,
} from "@clnt/types/student-types";
import { useQuickDialogStore } from "@clnt/lib/store/quick-create-dialog-store";

export function UserGroupCreateForm() {
  const toggleQuickDialog = useQuickDialogStore(
    (state) => state.toggleQuickDialog,
  );
  const form = useForm<UserGroupFormData>({
    resolver: zodResolver(userGroupFormSchema),
    defaultValues: {
      classroomId: undefined,
      groupName: undefined,
      studentIds: [],
      limit: 10,
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

  const { mutateAsync, status } = useUserGroupPost();
  const onSubmit = async (data: UserGroupFormData) => {
    //console.log("🚀 ~ onSubmit ~ data:", data);
    toast.promise(mutateAsync(data), {
      loading: "Creating course...",
      success: (message) => {
        form.reset();
        toggleQuickDialog(); // Close dialog
        return message;
      },
      error: (error) => error.response.data.message,
    });
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

  const selectedClassroomId = form.watch("classroomId");
  const studentOptions: StudentOption[] = (
    userStudentsQry as StudentWithGroups[]
  )
    ?.filter((student: StudentWithGroups) => {
      if (!selectedClassroomId) return true;

      const groups: UserGroup[] = student.student?.userGroups ?? [];
      const alreadyAssigned: boolean = groups.some(
        (group: UserGroup) => group.classroomId === selectedClassroomId,
      );

      return !alreadyAssigned;
    })
    .map((student: StudentWithGroups) => ({
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

        <Button type="submit" className="w-full">
          {status === "pending"
            ? "Creating User Group..."
            : "Create User Group"}
        </Button>
      </form>
    </Form>
  );
}

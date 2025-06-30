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
import { useAppStateStore } from "@clnt/lib/store/app-state-store";
import { Skeleton } from "../ui/skeleton";
import { MultiSelect } from "../ui/multi-select";
import {
  UserGroupFormData,
  userGroupFormSchema,
} from "@clnt/lib/validators/user-group-schema";
import { useUsersByRoleQuery } from "@clnt/lib/queries/user-query";
import { useUserGroupPost } from "@clnt/lib/mutations/user-group-mutation";

export function UserGroupForm() {
  const { toggleQuickCreateDialog } = useAppStateStore();
  const form = useForm<UserGroupFormData>({
    resolver: zodResolver(userGroupFormSchema),
    defaultValues: {
      groupName: undefined,
      studentIds: [],
    },
  });

  const {
    data: userStudentsQry = [],
    isLoading: isUserStudentsLoading,
    error: errorOnUserStudents,
  } = useUsersByRoleQuery({ role: "student" });

  const { mutateAsync, status } = useUserGroupPost();
  const onSubmit = async (data: UserGroupFormData) => {
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

  if (isUserStudentsLoading)
    return (
      <>
        <Skeleton className="w-18 h-4" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-18 h-4" />
        <Skeleton className="w-full h-8" />
      </>
    );
  if (errorOnUserStudents) return <div>Failed to load resources</div>;

  const studentOptions = userStudentsQry.map(
    (student: { id: string; name: string }) => ({
      value: student.id,
      label: student.name,
    }),
  );

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

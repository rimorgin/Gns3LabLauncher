// src/components/forms/UserCreateForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserCreateData,
  userCreateSchema,
} from "@clnt/lib/validators/user-schema";
import { Input, StringArrayInput } from "@clnt/components/ui/input";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@clnt/components/ui/form";
import { useClassroomsQuery } from "@clnt/lib/queries/classrooms-query";
import { MultiSelect } from "@clnt/components/ui/multi-select";
import { useUserPost } from "@clnt/lib/mutations/user/user-create-mutation";
import { toast } from "sonner";
import { Skeleton } from "@clnt/components/ui/skeleton";
import { useUserGroupsQuery } from "@clnt/lib/queries/user-groups-query";
import { useEffect } from "react";
import { useQuickDialogStore } from "@clnt/lib/store/quick-create-dialog-store";

export function UserCreateForm() {
  const toggleQuickDialog = useQuickDialogStore(
    (state) => state.toggleQuickDialog,
  );
  const form = useForm<UserCreateData>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      role: undefined,
    },
  });

  // Fetch classrooms with embedded course data
  const {
    data: classroomQry = [],
    isLoading: isClassroomsLoading,
    error: errorOnClassrooms,
    // EMBED DATA with boolean option TRUE
  } = useClassroomsQuery({ includes: ["course"] });
  const {
    data: userGroupQry = [],
    isLoading: isUserGroupLoading,
    error: errorOnUserGroup,
    // EMBED DATA with boolean option TRUE
  } = useUserGroupsQuery({ includes: ["classroom"] });
  const { mutateAsync, status } = useUserPost();
  //console.log("🚀 ~ UserForm ~ classesQry:", classroomQry);

  const onSubmit = async (data: UserCreateData) => {
    const email = data.email.toLowerCase();
    const newData = { ...data, email: email };
    toast.promise(mutateAsync(newData), {
      loading: "Creating user...",
      success: (message) => {
        form.reset();
        toggleQuickDialog(); // Close dialog
        return message;
      },
      error: (error) => error.response.data.message,
    });
    //console.log("🚀 ~ onSubmit ~ newData:", newData);
  };

  const groupIds = form.watch("student.groupIds");
  const role = form.watch("role");

  useEffect(() => {
    if (role !== "student" || !groupIds?.length) return;

    const classroomIds = new Set(
      groupIds
        .map((groupId) => {
          const matchedGroup = userGroupQry.find(
            (grp: { id: string }) => grp.id === groupId,
          );
          return matchedGroup?.classroomId;
        })
        .filter(Boolean),
    );

    form.setValue("student.classroomIds", Array.from(classroomIds), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [groupIds, role]);

  if (isClassroomsLoading && isUserGroupLoading)
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
  if (errorOnClassrooms && errorOnUserGroup)
    return <div>Failed to load resources</div>;

  const classroomOptions = classroomQry?.map(
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

  const userGroupOptions = userGroupQry?.map(
    (group: {
      id: string;
      groupName: string;
      classrooms: { classroomName: string };
    }) => ({
      value: group.id,
      label: `${group.groupName} (${group.classrooms.classroomName})`,
    }),
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Full Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="gns3@user.net" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="NetSec Labber" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger
                    value={field.value}
                    onReset={() => form.resetField("role")}
                  >
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("role") === "instructor" && (
          <FormField
            control={form.control}
            name="instructor.expertise"
            render={({ field }) => (
              <FormItem>
                <FormLabel optional>Instructor Expertise</FormLabel>
                <FormControl>
                  <StringArrayInput
                    value={(field.value ?? []).filter(
                      (v): v is string => typeof v === "string",
                    )}
                    onChange={field.onChange}
                    placeholder="Add expertise..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {form.watch("role") === "student" && (
          <FormField
            control={form.control}
            name="student.groupIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel optional>Select Groups</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={userGroupOptions}
                    value={(field.value ?? []).filter(Boolean) as string[]}
                    onValueChange={field.onChange}
                    placeholder="Select Groups"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name={`${form.watch("role")}.classroomIds`}
          render={({ field }) => (
            <FormItem>
              <FormLabel optional>Select Classrooms</FormLabel>
              <FormControl>
                <MultiSelect
                  key={(field.value ?? []).join("-")}
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
          {status === "pending" ? "Creating User..." : "Create User"}
        </Button>
      </form>
    </Form>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserDbData,
  UserEditData,
  userEditSchema,
} from "@clnt/lib/validators/user-schema";
import { Input, StringArrayInput } from "@clnt/components/ui/input";
import { Button } from "@clnt/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
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
import { useUserPatch } from "@clnt/lib/mutations/user/user-update-mutation";
import { toast } from "sonner";
import { Skeleton } from "@clnt/components/ui/skeleton";
import { deepEqual, safeIds } from "@clnt/lib/utils";
import { useUserGroupsQuery } from "@clnt/lib/queries/user-groups-query";
import { useQuickDrawerStore } from "@clnt/lib/store/quick-drawer-store";

interface UserEditProps {
  initialData: Partial<UserDbData>;
}

export function UserUpdateForm({ initialData }: UserEditProps) {
  const toggleQuickDrawer = useQuickDrawerStore(
    (state) => state.toggleQuickDrawer,
  );
  const form = useForm<UserEditData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      username: initialData?.username || "",
      role: initialData?.role || "student",
      ...(initialData.role === "instructor"
        ? {
            instructor: {
              expertise: initialData.instructor?.expertise.filter(
                Boolean,
              ) as string[],
              classroomIds: safeIds(
                initialData.instructor?.classrooms.map((c) => c.id),
              ),
            },
          }
        : {
            student: {
              classroomIds: safeIds(
                initialData.student?.classrooms.map((c) => c.id),
              ),
              groupIds: safeIds(
                initialData.student?.userGroups.map((c) => c.id),
              ),
            },
          }),
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
  } = useUserGroupsQuery({});
  const { mutateAsync, status } = useUserPatch();
  //console.log("🚀 ~ UserForm ~ classesQry:", classroomQry);

  const onSubmit = async (data: UserEditData) => {
    try {
      if (!initialData?.id) {
        toast.error("User ID is missing. Cannot update user.");
        return;
      }
      const defaultData = form.formState.defaultValues ?? {};
      // Always include 'role' in the payload
      // Build payload, including nested 'student' or 'instructor' only if changed
      const payload: UserEditData = Object.fromEntries(
        Object.entries({
          ...data,
          email: data.email?.toLowerCase(),
        }).filter(([key, value]) => {
          if (key === "role") return true;
          const prev = (defaultData as Record<string, unknown>)[key];
          return !deepEqual(prev, value) && value !== undefined && value !== "";
        }),
      ) as UserEditData;

      if (
        Object.keys(payload).length === 1 &&
        Object.keys(payload)[0] === "role"
      ) {
        return toast.info("Aborting... You have not made any changes at all");
      }
      console.log("🚀 ~ handleUpdate ~ payload:", payload);

      toast.promise(mutateAsync({ id: initialData.id, data: payload }), {
        loading: "Updating user...",
        success: (message) => {
          toggleQuickDrawer();
          return message;
        },
        error: (err) => err?.response?.data?.message || "Failed to update user",
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

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
    (group: { id: string; groupName: string }) => ({
      value: group.id,
      label: group.groupName,
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
              <FormLabel>Password {"(Leave blank to keep current)"}</FormLabel>
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
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("role") === "instructor" ? (
          <FormField
            control={form.control}
            name="instructor.expertise"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructor Expertise</FormLabel>
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
        ) : (
          <FormField
            control={form.control}
            name="student.groupIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel optional>Select Groups</FormLabel>
                <FormControl>
                  <MultiSelect
                    defaultValue={form.getValues().student?.groupIds}
                    options={userGroupOptions}
                    value={(field.value ?? []).filter(Boolean) as string[]}
                    onValueChange={field.onChange}
                    placeholder="Select Groups"
                    className="w-full"
                    maxCount={1000}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name={
            form.watch("role") === "instructor"
              ? "instructor.classroomIds"
              : "student.classroomIds"
          }
          render={({ field }) => (
            <FormItem>
              <FormLabel optional>Select Classrooms</FormLabel>
              <FormControl>
                <MultiSelect
                  defaultValue={
                    form.getValues()[form.watch("role") ?? "student"]
                      ?.classroomIds
                  }
                  options={classroomOptions}
                  value={(field.value ?? []).filter(Boolean) as string[]}
                  onValueChange={field.onChange}
                  placeholder="Select Classrooms"
                  className="w-full"
                  maxCount={1000}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full px-4 absolute bottom-17 right-0">
          <Button type="submit" className="w-full">
            {status === "pending" ? "Updating User..." : "Update User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

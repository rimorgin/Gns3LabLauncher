// src/components/forms/UserForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema, UserFormData } from "@clnt/lib/validators/user-schema";
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
import { MultiSelect } from "../ui/multi-select";
import { useUserPost } from "@clnt/lib/mutations/user-mutation";
import { toast } from "sonner";
import { useAppStateStore } from "@clnt/lib/store/app-state-store";
import { Skeleton } from "../ui/skeleton";

export function UserForm() {
   const { toggleQuickCreateDialog } = useAppStateStore();
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      role: "student",
      instructor: {
        expertise: [], // for instructor role only
        classroomIds: [], // optional
      },
      student: {
        classroomIds: [], // optional
      },
    },
  });

  // Fetch classrooms with embedded course data
  const {
    data: classroomQry = [],
    isLoading: isClassroomsLoading,
    error: errorOnClassrooms,
    // EMBED DATA with boolean option TRUE
  } = useClassroomsQuery({includes: ["course"]});
  const { mutateAsync, status } = useUserPost();
  console.log("🚀 ~ UserForm ~ classesQry:", classroomQry);

  const onSubmit = async (data: UserFormData) => {
    const email = data.email.toLowerCase();
    const newData = { ...data, email: email };
    toast.promise(mutateAsync(newData), {
      loading: "Creating user...",
      success: (message) => {
        form.reset();
        toggleQuickCreateDialog(); // Close dialog
        return message;
      },
      error: (error) => error.response.data.message,
    });
    console.log("🚀 ~ onSubmit ~ newData:", newData)
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
        <Skeleton className="w-18 h-4" />
        <Skeleton className="w-full h-8" />
      </>
    );
  if (errorOnClassrooms) return <div>Failed to load resources</div>;

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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        {form.watch("role") === "instructor" && (
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
        )}

        <FormField
          control={form.control}
          name={`${form.watch("role")}.classroomIds`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Select Classes
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
          {status === "pending" ? "Creating User..." : "Create User"}
        </Button>
      </form>
    </Form>
  );
}

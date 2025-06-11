// src/components/forms/UserForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema, UserFormData } from "@clnt/lib/validators/user-schema";
import { Input } from "@clnt/components/ui/input";
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
import { useClassroomsQuery } from "@clnt/lib/query/classroom-query";
import { MultiSelect } from "../ui/multi-select";
import { useUserPost } from "@clnt/lib/query/user-query";
import { toast } from "sonner";
import { useAppStateStore } from "@clnt/lib/store/app-state-store";

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
      classes: [],
    },
  });

  // Fetch classrooms with embedded course data                                                   EMBED DATA with boolean option TRUE
  const {
    data: classesQry = [],
    isLoading: isClassroomsLoading,
    error: errorOnClassrooms,
  } = useClassroomsQuery(true);
  const { mutateAsync, status } = useUserPost();
  console.log("🚀 ~ UserForm ~ classesQry:", classesQry);

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
  };

  if (isClassroomsLoading) return <div>Loading…</div>;
  if (errorOnClassrooms) return <div>Failed to load resources</div>;

  const classOptions = classesQry?.map(
    (cls: {
      _id: string;
      classname: string;
      status: string;
      courseid?: { coursecode: string };
    }) => ({
      value: cls._id,
      label: `${cls.courseid ? `${cls.courseid.coursecode}` : ""} ${cls.classname} (${cls.status})`,
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

        {/* <FormField
          control={form.control}
          name="classes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign to Course</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="e.g. IT186-8L" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Courses</SelectLabel>
                    {classessqry.map(
                      (cls: {
                        _id: string;
                        coursecode: string;
                        coursename: string;
                      }) => (
                        <SelectItem key={cls._id} value={cls._id}>
                          {cls.coursecode}-{cls.coursename}
                        </SelectItem>
                      ),
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="classes"
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
                  placeholder="Select classes"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {status === 'pending' ? "Creating User..." : "Create User"}
        </Button>
      </form>
    </Form>
  );
}

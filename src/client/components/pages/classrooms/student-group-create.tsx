"use client";

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
import { useUserGroupPost } from "@clnt/lib/mutations/usergroup/user-group-create-mutation";
import { getRandomImage } from "@clnt/lib/utils";
import {
  UserGroupFormData,
  userGroupFormSchema,
} from "@clnt/lib/validators/user-group-schema";

export function StudentGroupCreate({
  classroomId,
  currentUserId,
}: {
  classroomId: string;
  currentUserId: string;
}) {
  const { mutateAsync, status } = useUserGroupPost();

  const form = useForm<UserGroupFormData>({
    resolver: zodResolver(userGroupFormSchema),
    defaultValues: {
      groupName: "",
      classroomId,
      studentIds: [],
      limit: 10,
    },
  });

  const onSubmit = async (data: UserGroupFormData) => {
    data.studentIds = [currentUserId];
    toast.promise(mutateAsync(data), {
      loading: "Creating group...",
      success: "Group created successfully!",
      error: "Failed to create group",
    });
    form.reset();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Create Your Group</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="groupName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., My Awesome Team" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Limit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 5"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <input
            type="hidden"
            {...form.register("imageUrl")}
            value={getRandomImage("userGroups")}
          />

          <Button type="submit" className="w-full">
            {status === "pending" ? "Creating..." : "Create Group"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

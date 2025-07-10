import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios.ts";
import { UserGroupFormData } from "@clnt/lib/validators/user-group-schema";

// ---- Mutation ----

export const postUserGroup = async (data: UserGroupFormData) => {
  const response = await axios.post("/user-groups", data);
  return response.data;
};

export const useUserGroupPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postUserGroup,
    // When mutate is called:
    onMutate: async (newUserGroup) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["user-groups"] });

      // Snapshot the previous value
      const previousUserGroup = queryClient.getQueryData(["user-groups"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["user-groups"], (old) =>
        Array.isArray(old) ? [...old, newUserGroup] : [newUserGroup],
      );

      // Return a context object with the snapshotted value
      return { previousUserGroup };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      if (context) {
        queryClient.setQueryData(["user-groups"], context.previousUserGroup);
      }
    },
    /* onSuccess: (newData) => {
      queryClient.setQueryData(
        ["user-groups"],
        (oldData: UserGroupFormData[]) => {
          if (!oldData) return [newData];
          return [...oldData, newData];
        },
      );
    }, */
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["user-groups"] }),
  });
};

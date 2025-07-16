import { UserBulkCreateData } from "@clnt/lib/validators/user-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";

const postBulkUser = async (data: UserBulkCreateData) => {
  const bulkRes = await axios.post("/users/bulk", data);
  return bulkRes.data;
};

export const useBulkUserPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postBulkUser,
    // When mutate is called:
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData(["users"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["users"], (old) =>
        Array.isArray(old) ? [...old, newData] : [newData],
      );

      // Return a context object with the snapshotted value
      return { previousUsers };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      if (context) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },
    /* onSuccess: (newData) => {
        queryClient.setQueryData(["users"], (oldData: UserCreateData[]) => {
          if (!oldData) return [newData];
          return [...oldData, newData];
        });
      }, */
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

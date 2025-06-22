import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from '@clnt/lib/axios.ts'
import { UserFormData } from "../validators/user-schema";

// ---- Mutation ----

export const postUser = async (data: UserFormData) => {
  const response = await axios.post("/users", data);
  return response.data;
};


export const useUserPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postUser,
    // When mutate is called:
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['users'] })

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(['users'])

      // Optimistically update to the new value
      queryClient.setQueryData(['users'], (old) => Array.isArray(old) ? [...old, newTodo] : [newTodo])

      // Return a context object with the snapshotted value
      return { previousTodos }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      if (context) {
        queryClient.setQueryData(['users'], context.previousTodos);
      }
    },
    /* onSuccess: (newData) => {
      queryClient.setQueryData(["users"], (oldData: UserFormData[]) => {
        if (!oldData) return [newData];
        return [...oldData, newData];
      });
    }, */
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });
};
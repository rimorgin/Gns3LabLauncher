import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from '@clnt/lib/axios.ts'
import { ProjectFormData } from "../validators/projects-schema";

// POST /projects (create a project)
export const postProjects = async (data: ProjectFormData) => {
  const response = await axios.post("/projects", data);
  return response.data;
};

// Mutations
export const useProjectsPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postProjects,
    // When mutate is called:
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['projects'] })

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(['projects'])

      // Optimistically update to the new value
      queryClient.setQueryData(['projects'], (old) => Array.isArray(old) ? [...old, newTodo] : [newTodo])

      // Return a context object with the snapshotted value
      return { previousTodos }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      if (context) {
        queryClient.setQueryData(['projects'], context.previousTodos);
      }
    },
    /* onSuccess: (newData) => {
      queryClient.setQueryData(["projects"], (oldData: ProjectFormData[]) => {
        if (!oldData) return [newData];
        return [...oldData, newData];
      });
    }, */
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
  });
};
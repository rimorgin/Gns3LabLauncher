import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";
import { ProjectFormData } from "../validators/projects-schema.ts";

// GET /projects
export const getProjectsFull = async () => {
  const response = await axios.get("/projects?embed_data=true");
  return response.data;
};

export const getProjectsPartial = async () => {
  const response = await axios.get("/projects");
  return response.data;
};

// POST /projects (create a project)
export const postProjects = async (data: ProjectFormData) => {
  const response = await axios.post("/projects", data);
  return response.data;
};

// Queries
export const useProjectsQuery = (full: boolean = false) =>
  useQuery({
    queryKey: ["projects"],
    queryFn: full ? getProjectsFull : getProjectsPartial,
  });

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

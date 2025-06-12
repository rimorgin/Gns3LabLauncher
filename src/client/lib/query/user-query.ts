import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";
import { UserFormData } from "../validators/user-schema";

// GET /courses
export const getUser = async () => {
  const response = await axios.get("/users");
  return response.data;
};

export const getUsersByRole = async (role: string) => {
  const response = await axios.get("/users", {
    params: { role },
  });
  return response.data;
};

// POST /courses (create a course)
export const postUser = async (data: UserFormData) => {
  const response = await axios.post("/users", data);
  return response.data;
};

// Queries
export const useUserQuery = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: getUser,
  });

export const useUserInstructorsQuery = () =>
  useQuery({
    queryKey: ["users", "instructors"],
    queryFn: () => getUsersByRole("instructor"),
  });

export const useUserStudentsQuery = () =>
  useQuery({
    queryKey: ["users", "students"],
    queryFn: () => getUsersByRole("student"),
  });
  
  
// Mutations
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

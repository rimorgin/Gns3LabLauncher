import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";
import { ClassroomFormData } from "../validators/classroom-schema";

// GET /classrooms
export const getClassroomsFull = async () => {
  const response = await axios.get("/classrooms?embed_data=true");
  return response.data;
};

export const getClassroomsPartial = async () => {
  const response = await axios.get("/classrooms");
  return response.data;
};

// POST /classroom (create a classroom)
export const postClassroom = async (data: ClassroomFormData) => {
  const response = await axios.post("/classrooms", data);
  return response.data;
};

// Queries
export const useClassroomsQuery = (full: boolean = false) =>
  useQuery({
    queryKey: ["classrooms"],
    queryFn: full ? getClassroomsFull : getClassroomsPartial,
  });

// Mutations
export const useClassroomsPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postClassroom,
    // When mutate is called:
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['classrooms'] })

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(['classrooms'])

      // Optimistically update to the new value
      queryClient.setQueryData(['classrooms'], (old) => Array.isArray(old) ? [...old, newTodo] : [newTodo])

      // Return a context object with the snapshotted value
      return { previousTodos }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      if (context) {
        queryClient.setQueryData(['classrooms'], context.previousTodos);
      }
    },
    /* onSuccess: (newData) => {
      queryClient.setQueryData<ClassroomFormData[]>(
        ["classrooms"],
        (oldData = []) => [...oldData, newData],
      );
    }, */
    // Always refetch after error or success:
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['classrooms'] })
  });
};

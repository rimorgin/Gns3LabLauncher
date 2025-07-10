import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClassroomFormData } from "@clnt/lib/validators/classroom-schema";
import axios from "@clnt/lib/axios.ts";

// POST /classroom (create a classroom)
export const postClassroom = async (data: ClassroomFormData) => {
  const response = await axios.post("/classrooms", data);
  return response.data;
};

// Mutations
export const useClassroomsPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postClassroom,
    // When mutate is called:
    onMutate: async (newClassroom) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["classrooms"] });

      // Snapshot the previous value
      const previousClassrooms = queryClient.getQueryData(["classrooms"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["classrooms"], (old) =>
        Array.isArray(old) ? [...old, newClassroom] : [newClassroom],
      );

      // Return a context object with the snapshotted value
      return { previousClassrooms };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      if (context) {
        queryClient.setQueryData(["classrooms"], context.previousClassrooms);
      }
    },
    /* onSuccess: (newData) => {
      queryClient.setQueryData<ClassroomFormData[]>(
        ["classrooms"],
        (oldData = []) => [...oldData, newData],
      );
    }, */
    // Always refetch after error or success:
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["classrooms"] }),
  });
};

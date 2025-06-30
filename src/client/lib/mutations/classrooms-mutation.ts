import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClassroomFormData } from "../validators/classroom-schema";
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

export const patchClassroom = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<ClassroomFormData>; // or whatever update shape you allow
}) => {
  const response = await axios.patch(`/classrooms/${id}`, data);
  return response.data;
};

export const useClassroomPatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchClassroom,

    onMutate: async (updatedClassroom) => {
      await queryClient.cancelQueries({ queryKey: ["classrooms"] });

      const previousClassrooms = queryClient.getQueryData(["classrooms"]);

      queryClient.setQueryData(["classrooms"], (old: ClassroomFormData) =>
        Array.isArray(old)
          ? old.map((item) =>
              item.id === updatedClassroom.id
                ? { ...item, ...updatedClassroom.data }
                : item,
            )
          : old,
      );

      return { previousClassrooms };
    },

    onError: (err, variables, context) => {
      if (context?.previousClassrooms) {
        queryClient.setQueryData(["classrooms"], context.previousClassrooms);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },
  });
};

export const deleteClassroom = async (id: string) => {
  const response = await axios.delete(`/classrooms/${id}`);
  return response.data;
};

export const useClassroomDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClassroom,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["classrooms"] });

      const previousClassrooms = queryClient.getQueryData(["classrooms"]);

      queryClient.setQueryData(["classrooms"], (old: ClassroomFormData) =>
        Array.isArray(old) ? old.filter((item) => item.id !== id) : old,
      );

      return { previousClassrooms };
    },

    onError: (err, id, context) => {
      if (context?.previousClassrooms) {
        queryClient.setQueryData(["classrooms"], context.previousClassrooms);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },
  });
};

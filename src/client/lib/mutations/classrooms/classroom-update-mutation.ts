import { ClassroomFormData } from "@clnt/lib/validators/classroom-schema";
import axios from "@clnt/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

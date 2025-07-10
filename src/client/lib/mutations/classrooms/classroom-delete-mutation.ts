import { ClassroomFormData } from "@clnt/lib/validators/classroom-schema";
import axios from "@clnt/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteClassroom = async (ids: string | string[]) => {
  const idList = Array.isArray(ids) ? ids : [ids];

  if (idList.length === 1) {
    // For single delete, send ID as query param
    return (await axios.delete(`/classrooms/${idList[0]}`)).data;
  } else {
    // For multiple delete, send IDs as body
    return (
      await axios.delete("/classrooms/many", {
        data: { ids: idList },
      })
    ).data;
  }
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

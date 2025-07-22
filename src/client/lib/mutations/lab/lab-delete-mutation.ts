import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";
import { Lab } from "@clnt/types/lab";

export const useDeleteLab = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/project-labs/${id}`);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["labs"] });
      const previousLabs = queryClient.getQueryData<Lab[]>(["labs"]);

      queryClient.setQueryData<Lab[]>(["labs"], (old) =>
        old?.filter((lab) => lab.id !== id),
      );

      return { previousLabs };
    },
    onError: (_err, _id, context) => {
      if (context?.previousLabs) {
        queryClient.setQueryData(["labs"], context.previousLabs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["labs"] });
    },
  });
};

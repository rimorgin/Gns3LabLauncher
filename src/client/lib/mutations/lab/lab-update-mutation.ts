import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";
import { Lab } from "@clnt/types/lab";

export const useUpdateLab = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Lab> }) => {
      const res = await axios.patch(`/project-labs/${id}`, data);
      return res.data as Lab;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["labs"] });
      const previousLabs = queryClient.getQueryData<Lab[]>(["labs"]);

      queryClient.setQueryData<Lab[]>(["labs"], (old) =>
        old?.map((lab) =>
          lab.id === id ? { ...lab, ...data, updatedAt: new Date() } : lab,
        ),
      );

      return { previousLabs };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousLabs) {
        queryClient.setQueryData(["labs"], context.previousLabs);
      }
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ["labs"] });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ["lab", data.id] });
      }
    },
  });
};

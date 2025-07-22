import { Lab } from "@clnt/types/lab";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";

export type LabInput = Omit<Lab, "id" | "createdAt" | "updatedAt">;

export const useCreateLab = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLab: LabInput) => {
      const { data } = await axios.post("/project-labs", newLab);
      return data as Lab;
    },
    onMutate: async (newLab) => {
      await queryClient.cancelQueries({ queryKey: ["labs"] });

      const previousLabs = queryClient.getQueryData<Lab[]>(["labs"]);

      const optimisticLab: Lab = {
        ...newLab,
        id: "temp-id-" + Date.now(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      queryClient.setQueryData<Lab[]>(["labs"], (old) =>
        old ? [...old, optimisticLab] : [optimisticLab],
      );

      return { previousLabs };
    },
    onError: (_err, _newLab, context) => {
      if (context?.previousLabs) {
        queryClient.setQueryData(["labs"], context.previousLabs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["labs"] });
    },
  });
};

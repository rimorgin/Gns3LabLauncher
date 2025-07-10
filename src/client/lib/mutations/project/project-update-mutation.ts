import { ProjectFormData } from "@clnt/lib/validators/projects-schema";
import axios from "@clnt/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const patchProject = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<ProjectFormData>; // or whatever update shape you allow
}) => {
  const response = await axios.patch(`/projects/${id}`, data);
  return response.data;
};

export const useProjectPatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchProject,

    onMutate: async (updatedProject) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      const previousProject = queryClient.getQueryData(["projects"]);

      queryClient.setQueryData(["projects"], (old: ProjectFormData) =>
        Array.isArray(old)
          ? old.map((item) =>
              item.id === updatedProject.id
                ? { ...item, ...updatedProject.data }
                : item,
            )
          : old,
      );

      return { previousProject };
    },

    onError: (err, variables, context) => {
      if (context?.previousProject) {
        queryClient.setQueryData(["projects"], context.previousProject);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

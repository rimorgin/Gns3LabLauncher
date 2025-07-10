import { ProjectFormData } from "@clnt/lib/validators/projects-schema";
import axios from "@clnt/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteProject = async (ids: string | string[]) => {
  const idList = Array.isArray(ids) ? ids : [ids];

  if (idList.length === 1) {
    // For single delete, send ID as query param
    return (await axios.delete(`/projects/${idList[0]}`)).data;
  } else {
    // For multiple delete, send IDs as body
    return (
      await axios.delete("/projects/many", {
        data: { ids: idList },
      })
    ).data;
  }
};

export const useProjectDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      const previousProjects = queryClient.getQueryData(["projects"]);

      queryClient.setQueryData(["projects"], (old: ProjectFormData[]) =>
        Array.isArray(old)
          ? old.filter((item) =>
              Array.isArray(id)
                ? !id.includes(item.projectName)
                : item.projectName !== id,
            )
          : old,
      );

      return { previousProjects };
    },

    onError: (err, id, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(["projects"], context.previousProjects);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

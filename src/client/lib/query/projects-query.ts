import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";
import { ProjectFormData } from "../validators/projects-schema.ts";

// GET /projects
export const getProjectsFull = async () => {
  const response = await axios.get("/projects?embed_data=true");
  return response.data;
};

export const getProjectsPartial = async () => {
  const response = await axios.get("/projects");
  return response.data;
};

// POST /projects (create a project)
export const postProjects = async (data: ProjectFormData) => {
  const response = await axios.post("/projects", data);
  return response.data;
};

// Queries
export const useProjectsQuery = (full: boolean = false) =>
  useQuery({
    queryKey: ["projects"],
    queryFn: full ? getProjectsFull : getProjectsPartial,
  });

// Mutations
export const useProjectsPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postProjects,
    onSuccess: (newData) => {
      queryClient.setQueryData(["projects"], (oldData: ProjectFormData[]) => {
        if (!oldData) return [newData];
        return [...oldData, newData];
      });
    },
  });
};

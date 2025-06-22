import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";
import { ProjectFormData } from "../validators/projects-schema.ts";

// GET /projects
const getProjects = async ({
  includes = 'none',
  only_ids = false,
  partial = false
}: {
  includes?: "classrooms" | "none",
  only_ids?: boolean,
  partial?: boolean
}) => {
  const params = new URLSearchParams();

  if (includes === 'classrooms') {
    params.append('classrooms', 'true');
  }

  if (only_ids) params.append("only_ids", "true");
  if (partial) params.append("partial", "true");

  const queryString = params.toString();
  console.log("🚀 ~ queryString:", queryString);

  const response = await axios.get(`/projects?${queryString}`);
  return response.data.projects;
};

// Queries
export const useProjectsQuery = ({
  includes = 'none',
  only_ids = false, 
  partial = false
}: {
  includes?: "classrooms" | "none", 
  only_ids?: boolean, 
  partial?: boolean
}) =>
  useQuery({
    queryKey: ["projects",{ includes: includes, only_ids, partial }],
    queryFn: () => getProjects({includes, only_ids, partial}),
  });


import { useQuery } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";

// GET /projects
const getProjects = async ({
  includes = [],
  only_ids = false,
  partial = false,
}: {
  includes?: string[];
  only_ids?: boolean;
  partial?: boolean;
}) => {
  const params = new URLSearchParams();

  for (const include of includes) {
    params.append(include, "true");
  }

  if (only_ids) params.append("only_ids", "true");
  if (partial) params.append("partial", "true");

  const queryString = params.toString();

  const response = await axios.get(`/projects?${queryString}`);
  return response.data.projects;
};

// Queries
export const useProjectsQuery = ({
  includes = [],
  only_ids = false,
  partial = false,
}: {
  includes?: Array<"classrooms" | "submissions">;
  only_ids?: boolean;
  partial?: boolean;
}) =>
  useQuery({
    queryKey: ["projects", { includes: includes, only_ids, partial }],
    queryFn: () => getProjects({ includes, only_ids, partial }),
  });

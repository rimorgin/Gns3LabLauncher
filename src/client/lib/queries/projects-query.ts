import { useQuery } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";

// GET /projects
const getProjects = async ({
  includes = [],
  only_ids = false,
  partial = false,
  by_id,
}: {
  includes?: string[];
  only_ids?: boolean;
  partial?: boolean;
  by_id?: string;
}) => {
  let url: string = "/projects";
  const params = new URLSearchParams();

  for (const include of includes) {
    params.append(include, "true");
  }

  if (only_ids) params.append("only_ids", "true");
  if (partial) params.append("partial", "true");
  if (by_id && by_id.trim() !== "") {
    url = url + `/${by_id}`;
    params.append("studentsCount", "true");
  }
  const queryString = params.toString();

  const response = await axios.get(`${url}?${queryString}`);
  return response.data.projects;
};

// Queries
export const useProjectsQuery = ({
  includes = [],
  only_ids = false,
  partial = false,
  by_id,
}: {
  includes?: Array<"classrooms" | "submissions" | "projectContent" | "labs">;
  only_ids?: boolean;
  partial?: boolean;
  by_id?: string;
}) =>
  useQuery({
    queryKey: [
      "projects",
      { by_id, includes: includes.sort(), only_ids, partial },
      includes,
    ],
    queryFn: () => getProjects({ by_id, includes, only_ids, partial }),
  });

import { useQuery } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";

export const getClassrooms = async ({
  includes = [],
  only_ids = false,
  by_id,
}: {
  includes?: string[];
  only_ids?: boolean;
  by_id?: string | string[];
}) => {
  const url = "/classrooms";
  const params = new URLSearchParams();

  for (const include of includes) {
    params.append(include, "true");
  }

  if (only_ids) params.append("only_ids", "true");

  if (by_id) {
    if (Array.isArray(by_id)) {
      by_id.forEach((id) => params.append("by_id", id));
    } else {
      params.append("by_id", by_id);
    }
  }

  const queryString = params.toString();
  const response = await axios.get(`${url}?${queryString}`);
  return response.data.classrooms;
};

// Queries

export const useClassroomsQuery = ({
  includes = [],
  only_ids = false,
  by_id,
}: {
  includes?: Array<
    | "course"
    | "courseId"
    | "projects"
    | "students"
    | "instructor"
    | "studentGroups"
  >;
  only_ids?: boolean;
  by_id?: string | string[];
}) =>
  useQuery({
    queryKey: [
      "classrooms",
      { includes: includes.sort(), only_ids, by_id },
      includes,
    ],
    queryFn: () => getClassrooms({ includes, only_ids, by_id }),
  });

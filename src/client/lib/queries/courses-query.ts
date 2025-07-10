import { useQuery } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";

// GET /courses
export const getCourses = async ({
  includes,
  only_ids = false,
}: {
  includes?: "classrooms";
  only_ids?: boolean;
}) => {
  const params = new URLSearchParams();
  if (only_ids) params.append("only_ids", "true");
  if (includes === "classrooms") params.append("classrooms", "true");
  const queryString = params.toString();
  const response = await axios.get(`/courses?${queryString}`);
  return response.data.courses;
};

// Queries
export const useCoursesQuery = ({
  includes,
  only_ids = false,
}: {
  includes?: "classrooms";
  only_ids?: boolean;
}) =>
  useQuery({
    queryKey: ["courses", { includes, only_ids }],
    queryFn: () => getCourses({ includes, only_ids }),
  });

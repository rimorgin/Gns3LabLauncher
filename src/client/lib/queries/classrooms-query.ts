import { useQuery } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";

// Example: course=courseinstructor=instructor
export const getClassrooms = async ({
  includes = [],
  only_ids = false,
}: {
  includes?: string[];
  only_ids?: boolean;
}) => {
  const params = new URLSearchParams();
  for (const include of includes) {
    params.append(include, "true");
  }

  if (only_ids) params.append("only_ids", "true")
  const queryString = params.toString()
  console.log("🚀 ~ queryString:", queryString)
  const response = await axios.get(`/classrooms?${queryString}`);
  return response.data.classrooms;
};

// Queries

export const useClassroomsQuery = ({
  includes = [],
  only_ids = false,
}: {
  includes?: Array<"course" | "courseId" | "projects" | "students" | "instructors">;
  only_ids?: boolean;
}) =>
  useQuery({
    queryKey: ["classrooms", { includes: includes.sort(), only_ids }],
    queryFn: () => getClassrooms({ includes, only_ids }),
  });
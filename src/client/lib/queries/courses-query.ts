import { useQuery } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";

// GET /courses
export const getCourses = async () => {
  const response = await axios.get("/courses");
  return response.data.courses;
};

// Queries
export const useCoursesQuery = () =>
  useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

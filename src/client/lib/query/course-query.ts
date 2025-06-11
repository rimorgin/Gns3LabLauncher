import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";
import { CourseFormData } from "../validators/course-schema.ts";

// GET /courses
export const getCourses = async () => {
  const response = await axios.get("/courses");
  return response.data;
};

// POST /courses (create a course)
export const postCourses = async (data: CourseFormData) => {
  const response = await axios.post("/courses", data);
  return response.data;
};

// Queries
export const useCoursesQuery = () =>
  useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

// Mutations
export const useCoursesPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCourses,
    onSuccess: (newData) => {
      queryClient.setQueryData(["courses"], (oldData: CourseFormData[]) => {
        if (!oldData) return [newData];
        return [...oldData, newData];
      });
    },
  });
};

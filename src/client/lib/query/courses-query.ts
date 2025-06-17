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
    // When mutate is called:
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['courses'] })

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(['courses'])

      // Optimistically update to the new value
      queryClient.setQueryData(['courses'], (old) => Array.isArray(old) ? [...old, newTodo] : [newTodo])

      // Return a context object with the snapshotted value
      return { previousTodos }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      if (context) {
        queryClient.setQueryData(['courses'], context.previousTodos);
      }
    },
    /* onSuccess: (newData) => {
      queryClient.setQueryData(["courses"], (oldData: CourseFormData[]) => {
        if (!oldData) return [newData];
        return [...oldData, newData];
      });
    }, */
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['courses'] })
  });
};

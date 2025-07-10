import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios.ts";
import { CourseFormData } from "@clnt/lib/validators/course-schema";

// POST /courses (create a course)
export const postCourses = async (data: CourseFormData) => {
  const response = await axios.post("/courses", data);
  return response.data;
};
// Mutations
export const useCoursesPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCourses,
    // When mutate is called:
    onMutate: async (newCourse) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["courses"] });

      // Snapshot the previous value
      const previousCourses = queryClient.getQueryData(["courses"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["courses"], (old) =>
        Array.isArray(old) ? [...old, newCourse] : [newCourse],
      );

      // Return a context object with the snapshotted value
      return { previousCourses };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      if (context) {
        queryClient.setQueryData(["courses"], context.previousCourses);
      }
    },
    /* onSuccess: (newData) => {
      queryClient.setQueryData(["courses"], (oldData: CourseFormData[]) => {
        if (!oldData) return [newData];
        return [...oldData, newData];
      });
    }, */
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
  });
};

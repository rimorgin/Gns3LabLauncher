import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios.ts";
import {
  CourseFormData,
  CourseDbData,
} from "@clnt/lib/validators/course-schema";

export const patchCourseById = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<CourseFormData>;
}) => {
  const response = await axios.patch(`/courses/${id}`, data);
  return response.data;
};

export const useCoursePatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchCourseById,
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["courses"] });

      const previousCourses = queryClient.getQueryData<CourseDbData[]>([
        "courses",
      ]);

      queryClient.setQueryData(["courses"], (old?: CourseDbData[]) => {
        if (!old) return old;

        return old.map((course) =>
          course.courseCode === id ? { ...course, ...data } : course,
        );
      });

      return { previousCourses };
    },
    onError: (err, variables, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(["courses"], context.previousCourses);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

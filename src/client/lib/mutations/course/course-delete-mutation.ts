import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios.ts";
import { CourseDbData } from "@clnt/lib/validators/course-schema";

export const deleteCourse = async (ids: string | string[]) => {
  const idList = Array.isArray(ids) ? ids : [ids];

  if (idList.length === 1) {
    // For single delete, send ID as query param
    return (await axios.delete(`/courses/${idList[0]}`)).data;
  } else {
    // For multiple delete, send IDs as body
    return (
      await axios.delete("/courses/many", {
        data: { ids: idList },
      })
    ).data;
  }
};
export const useCourseDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourse,
    onMutate: async (ids: string | string[]) => {
      await queryClient.cancelQueries({ queryKey: ["courses"] });

      const previousCourses = queryClient.getQueryData<CourseDbData[]>([
        "courses",
      ]);

      const idSet = new Set(Array.isArray(ids) ? ids : [ids]);

      queryClient.setQueryData(["courses"], (old?: CourseDbData[]) => {
        if (!old) return old;
        return old.filter((course) => !idSet.has(course.courseCode));
      });

      return { previousCourses };
    },
    onError: (err, id, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(["courses"], context.previousCourses);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

import { useQuery } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";
import { ProjectComment } from "@clnt/components/pages/project/comments-section";

export const fetchComments = async (
  projectId: string,
): Promise<ProjectComment[]> => {
  const res = await axios.get(`/project-comments/${projectId}`);
  return res.data;
};

export const useProjectCommentsQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["project-comments", projectId],
    queryFn: () => fetchComments(projectId),
    enabled: !!projectId, // Only run if projectId is available
  });
};

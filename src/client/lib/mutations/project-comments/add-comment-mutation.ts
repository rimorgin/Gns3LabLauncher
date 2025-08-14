import { ProjectComment } from "@clnt/components/pages/project/comments-section";
import axios from "@clnt/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const addComment = async ({
  projectId,
  commentText,
}: {
  projectId: string;
  commentText: string;
}) => {
  const res = await axios.post(`/project-comments/${projectId}/comments`, {
    commentText,
  });
  return res.data;
};

export const useProjectCommentsAddComment = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { commentText: string }) =>
      addComment({ projectId, ...data }),
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ["comments", projectId] });

      const prevComments = queryClient.getQueryData<ProjectComment[]>([
        "comments",
        projectId,
      ]);

      const optimisticComment = {
        id: `temp-${Date.now()}`,
        userName: "You",
        commentText: newComment.commentText,
        createdAt: new Date().toISOString(),
        projectId,
        parentId: null,
        replies: [],
        user: { id: "temp-user", name: "You" },
      };

      queryClient.setQueryData(
        ["comments", projectId],
        (old: ProjectComment[] = []) => [optimisticComment, ...old],
      );

      return { prevComments };
    },
    onError: (_err, _newComment, context) => {
      if (context?.prevComments) {
        queryClient.setQueryData(["comments", projectId], context.prevComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", projectId] });
    },
  });
};

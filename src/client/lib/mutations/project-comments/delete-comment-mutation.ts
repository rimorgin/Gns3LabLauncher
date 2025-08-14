// lib/mutations/project-comments/delete-comment-mutation.ts
import { ProjectComment } from "@clnt/components/pages/project/comments-section";
import axios from "@clnt/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteComment = async ({
  projectId,
  commentId,
}: {
  projectId: string;
  commentId: string;
}) => {
  await axios.delete(`/project-comments/${projectId}/comments/${commentId}`);
};

export const useProjectCommentsDeleteComment = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { commentId: string }) =>
      deleteComment({ projectId, ...data }),
    onMutate: async ({ commentId }) => {
      await queryClient.cancelQueries({ queryKey: ["comments", projectId] });

      const prevComments = queryClient.getQueryData<ProjectComment[]>([
        "comments",
        projectId,
      ]);

      queryClient.setQueryData(
        ["comments", projectId],
        (old: ProjectComment[] = []) => old.filter((c) => c.id !== commentId),
      );

      return { prevComments };
    },
    onError: (_err, _vars, context) => {
      if (context?.prevComments) {
        queryClient.setQueryData(["comments", projectId], context.prevComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", projectId] });
    },
  });
};

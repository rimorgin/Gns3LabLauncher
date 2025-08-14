import { ProjectComment } from "@clnt/components/pages/project/comments-section";
import axios from "@clnt/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const addReply = async ({
  projectId,
  parentId,
  commentText,
}: {
  projectId: string;
  parentId: string;
  commentText: string;
}) => {
  const res = await axios.post(
    `/project-comments/${projectId}/comments/${parentId}/replies`,
    {
      commentText,
    },
  );
  return res.data;
};

export const useProjectCommentsAddReply = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { parentId: string; commentText: string }) =>
      addReply({ projectId, ...data }),
    onMutate: async (newReply) => {
      await queryClient.cancelQueries({ queryKey: ["comments", projectId] });

      const prevComments = queryClient.getQueryData<ProjectComment[]>([
        "comments",
        projectId,
      ]);

      queryClient.setQueryData(
        ["comments", projectId],
        (old: ProjectComment[] = []) =>
          old.map((comment) =>
            comment.id === newReply.parentId
              ? {
                  ...comment,
                  replies: [
                    ...(comment.replies ?? []),
                    {
                      id: `temp-${Date.now()}`,
                      userName: "You",
                      commentText: newReply.commentText,
                      createdAt: new Date().toISOString(),
                      projectId,
                      parentId: newReply.parentId,
                      user: { id: "temp-user", name: "You" },
                    },
                  ],
                }
              : comment,
          ),
      );

      return { prevComments };
    },
    onError: (_err, _newReply, context) => {
      if (context?.prevComments) {
        queryClient.setQueryData(["comments", projectId], context.prevComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", projectId] });
    },
  });
};

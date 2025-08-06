import axios from "@clnt/lib/axios";
import { ICronJob } from "@clnt/types/cron-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function updateCronJob(
  key: string,
  data: Partial<Pick<ICronJob, "enabled">>,
) {
  const res = await axios.patch(`/cron/${key}`, data);
  return res.data;
}

export function useUpdateCronJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) =>
      updateCronJob(key, { enabled }),

    onMutate: async ({ key, enabled }) => {
      await queryClient.cancelQueries({ queryKey: ["cron-jobs"] });

      const previous = queryClient.getQueryData<ICronJob[]>(["cron-jobs"]);

      // Optimistically update the cron job in the cache
      queryClient.setQueryData<ICronJob[]>(["cron-jobs"], (old = []) =>
        old.map((job) => (job.key === key ? { ...job, enabled } : job)),
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["cron-jobs"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cron-jobs"] });
    },
  });
}

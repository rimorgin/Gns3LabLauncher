import axios from "@clnt/lib/axios";
import { ICronJob } from "@clnt/types/cron-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function toggleCronJob(key: string, enabled: boolean) {
  const res = await axios.patch(`/cron/${key}/toggle`, { enabled });
  return res.data;
}

export function useToggleCronJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) =>
      toggleCronJob(key, enabled),

    onMutate: async ({ key, enabled }) => {
      await queryClient.cancelQueries({ queryKey: ["cron-jobs"] });

      const previous = queryClient.getQueryData<ICronJob[]>(["cron-jobs"]);

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

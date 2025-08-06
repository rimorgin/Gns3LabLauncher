import axios from "@clnt/lib/axios";
import { useQuery } from "@tanstack/react-query";

async function fetchCronJobs() {
  const res = await axios.get("/cron");
  return res.data;
}

export function useCronJobsQuery() {
  return useQuery({
    queryKey: ["cron-jobs"],
    queryFn: fetchCronJobs,
  });
}

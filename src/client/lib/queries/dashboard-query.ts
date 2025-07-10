import axios from "@clnt/lib/axios";
import { useQuery } from "@tanstack/react-query";

const getDashboard = async () => {
  const [summaryRes, seriesRes] = await Promise.all([
    axios.get("/dashboard/summary"),
    axios.get("/dashboard/series"),
  ]);
  return {
    summary: summaryRes.data.summary,
    series: seriesRes.data.series,
  };
};

export const useDashboardQuery = () => {
  return useQuery({
    queryKey: ["dashboard", "cards"],
    queryFn: getDashboard,
  });
};

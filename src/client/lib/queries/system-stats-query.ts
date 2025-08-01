import axios from "@clnt/lib/axios";
import { useQuery } from "@tanstack/react-query";
const getSystemStats = async () => {
  const res = await axios.get("/system-stats/docker-stat");
  return res.data.stats;
};

export const useSystemStatsQuery = () => {
  return useQuery({
    queryKey: ["system-stats"],
    queryFn: getSystemStats,
  });
};

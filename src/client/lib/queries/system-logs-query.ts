import axios from "@clnt/lib/axios";
import { useQuery } from "@tanstack/react-query";
const getLogs = async () => {
  const res = await axios.get("/system-logs");
  return res.data.logs;
};

export const useLogsQuery = () => {
  return useQuery({
    queryKey: ["system-logs"],
    queryFn: getLogs,
  });
};

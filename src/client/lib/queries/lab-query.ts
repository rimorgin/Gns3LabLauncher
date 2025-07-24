import { Lab } from "@clnt/types/lab";
import axios from "../axios";
import { useQuery } from "@tanstack/react-query";

export const useLabsQuery = () => {
  return useQuery<Lab[]>({
    queryKey: ["labs"],
    queryFn: async () => {
      const { data } = await axios.get("/project-labs");
      return data;
    },
  });
};

export const useLabQuery = (id: string) => {
  return useQuery<Lab>({
    queryKey: ["lab", id],
    queryFn: async () => {
      const { data } = await axios.get(`/project-labs/${id}`);
      return data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

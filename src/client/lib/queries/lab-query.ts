import { Lab } from "@clnt/types/lab";
import axios from "../axios";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useLabsQuery = () => {
  return useQuery<Lab[]>({
    queryKey: ["labs"],
    queryFn: async () => {
      const { data } = await axios.get("/project-labs");
      return data;
    },
  });
};

export const useLabQuery = (
  id: string,
  options?: Omit<
    UseQueryOptions<Lab, Error, Lab, [string, string]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<Lab, Error, Lab, [string, string]>({
    queryKey: ["lab", id],
    queryFn: async () => {
      const { data } = await axios.get(`/project-labs/${id}`);
      return data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    ...options,
  });
};

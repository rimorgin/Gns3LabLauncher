import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";

// Start Container Mutation
export const useStartContainerInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (containerName: string) => {
      const response = await axios.post(`/gns3labs/start/${containerName}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    },
    onError: (err) => {
      console.error("❌ Failed to start container", err);
    },
  });
};

// Stop Container Mutation
export const useStopContainerInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (containerName: string) =>
      axios.post(`/gns3labs/stop/${containerName}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    },
    onError: (err) => {
      console.error("❌ Failed to stop container", err);
    },
  });
};

// Stop Container Mutation
export const useRestartContainerInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (containerName: string) =>
      axios.post(`/gns3labs/restart/${containerName}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    },
    onError: (err) => {
      console.error("❌ Failed to stop container", err);
    },
  });
};

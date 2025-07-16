import axios from "@clnt/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ProgressPayload {
  projectId?: string;
  studentId?: string;
  percentComplete: number;
  status: string;
}

export const patchProgress = async ({
  id,
  data,
}: {
  id: string;
  data: ProgressPayload;
}) => {
  let url: string = "/progress";
  if (id && id.trim() !== "") {
    url = `/progress/${id}`;
  }
  console.log("🚀 ~ url:", url);

  const progressRes = await axios.patch(url, data);
  return progressRes.data.progress;
};

export const useProgressPatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
};

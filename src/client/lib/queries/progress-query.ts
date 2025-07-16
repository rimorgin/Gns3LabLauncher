import { useQuery } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";

interface getProgressProps {
  projectId: string | undefined;
  studentId: string | undefined;
}

export const getProgress = async ({
  projectId,
  studentId,
}: getProgressProps) => {
  const progressRes = await axios.get(`/progress/${projectId}/${studentId}`);
  return progressRes.data.progress; // returns your Progress object
};

export const useProgress = ({ projectId, studentId }: getProgressProps) => {
  return useQuery({
    queryKey: ["progress", projectId, studentId],
    queryFn: () => getProgress({ projectId, studentId }),
  });
};

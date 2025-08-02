import { useMutation } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";

const postGradeProgress = async ({
  submissionId,
  formData,
}: {
  submissionId: string;
  formData: Record<string, string | number>;
}) => {
  const res = await axios.patch(`/lab-submission/${submissionId}`, formData);
  return res.data;
};

export const useGradeLab = () => {
  return useMutation({
    mutationFn: postGradeProgress,
  });
};

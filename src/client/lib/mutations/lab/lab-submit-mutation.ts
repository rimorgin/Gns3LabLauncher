import { useMutation } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";

const postLabProgress = async (formData: FormData) => {
  const res = await axios.post("/lab-submission", formData);
  return res.data;
};

export const useSubmitLab = () => {
  return useMutation({
    mutationFn: postLabProgress,
  });
};

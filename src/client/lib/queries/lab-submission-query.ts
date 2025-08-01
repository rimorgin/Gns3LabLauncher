import { useQuery } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";
import { LabSubmission } from "@clnt/types/submission";
import { Lab } from "@clnt/types/lab";

type LabSubmissionsResponse = {
  submissions: LabSubmission[];
  labs: Lab[];
};

const getLabSubmissions = async (params: {
  classroomId: string | undefined;
  studentId?: string;
}): Promise<LabSubmissionsResponse> => {
  const res = await axios.get("/lab-submission/" + params.classroomId, {
    params: params.studentId ? { studentId: params.studentId } : {},
  });
  return res.data;
};

export const useLabSubmissionsQuery = (params: {
  classroomId: string | undefined;
  studentId?: string;
}) =>
  useQuery({
    queryKey: ["lab-submissions", { params }],
    queryFn: () => getLabSubmissions(params),
  });

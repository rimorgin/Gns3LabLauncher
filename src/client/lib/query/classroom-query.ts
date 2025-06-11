import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";
import { ClassroomFormData } from "../validators/classroom-schema";

// GET /classrooms
export const getClassroomsFull = async () => {
  const response = await axios.get("/classrooms?embed_data=true");
  return response.data;
};

export const getClassroomsPartial = async () => {
  const response = await axios.get("/classrooms");
  return response.data;
};

// POST /classroom (create a classroom)
export const postClassroom = async (data: ClassroomFormData) => {
  const response = await axios.post("/classrooms", data);
  return response.data;
};

// Queries
export const useClassroomsQuery = (full: boolean = false) =>
  useQuery({
    queryKey: ["classrooms"],
    queryFn: full ? getClassroomsFull : getClassroomsPartial,
  });

// Mutations
export const useClassroomsPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postClassroom,
    onSuccess: (newData) => {
      queryClient.setQueryData<ClassroomFormData[]>(
        ["classrooms"],
        (oldData = []) => [...oldData, newData],
      );
    },
  });
};

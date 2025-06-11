import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";
import { UserFormData } from "../validators/user-schema";

// GET /courses
export const getUser = async () => {
  const response = await axios.get("/users");
  return response.data;
};

export const getUsersByRole = async (role: string) => {
  const response = await axios.get("/users", {
    params: { role },
  });
  return response.data;
};

// POST /courses (create a course)
export const postUser = async (data: UserFormData) => {
  const response = await axios.post("/users", data);
  return response.data;
};

// Queries
export const useUserQuery = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: getUser,
  });

export const useUserInstructorsQuery = () =>
  useQuery({
    queryKey: ["users", "instructors"],
    queryFn: () => getUsersByRole("instructor"),
  });

export const useUserStudentsQuery = () =>
  useQuery({
    queryKey: ["users", "students"],
    queryFn: () => getUsersByRole("student"),
  });
  
  
// Mutations
export const useUserPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postUser,
    onSuccess: (newData) => {
      queryClient.setQueryData(["users"], (oldData: UserFormData[]) => {
        if (!oldData) return [newData];
        return [...oldData, newData];
      });
    },
  });
};

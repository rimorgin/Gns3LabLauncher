import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";
import { UserFormData } from "../validators/user-schema.ts";

// ---- API Functions ----

export const getUsers = async (filters?: { role?: string }) => {
  const response = await axios.get("/users", {
    params: filters,
  });
  return response.data.users;
};

// ---- Queries ----

export const useUsersQuery = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

export const useUsersByRoleQuery = ({role="both"}:{role: "student" | "instructor" | "both"}) =>
  useQuery({
    queryKey: ["users", { role }],
    queryFn: () => getUsers({ role }),
    enabled: !!role,
  });
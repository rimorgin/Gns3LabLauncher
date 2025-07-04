import { useQuery } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";

// ---- API Functions ----

export const getUsers = async (filters?: {
  role?: string;
  includeRoleData?: boolean;
  includeRoleRelations?: boolean;
}) => {
  const response = await axios.get("/users", {
    params: filters,
  });
  //console.log(response);
  return response.data.users;
};

// ---- Queries ----

export const useUsersByRoleQuery = ({
  role,
  includeRoleData = false,
  includeRoleRelations = false,
}: {
  role?: "student" | "instructor" | undefined;
  includeRoleData?: boolean;
  includeRoleRelations?: boolean;
}) =>
  useQuery({
    queryKey: ["users", { role, includeRoleData, includeRoleRelations }],
    queryFn: () => getUsers({ role, includeRoleData, includeRoleRelations }),
  });

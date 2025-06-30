import { useQuery } from "@tanstack/react-query";
import axios from "../axios";

export const getUserGroups = async (filter?: { only_ids: string }) => {
  const response = await axios.get("/user-groups", {
    params: filter,
  });
  return response.data.user_groups;
};

export const useUserGroupsQuery = (filter?: { only_ids: string }) => {
  return useQuery({
    queryKey: [`user-group`, filter],
    queryFn: () => getUserGroups(filter),
  });
};

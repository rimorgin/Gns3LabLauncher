import { useQuery } from "@tanstack/react-query";
import axios from "../axios";

export const getUserGroups = async ({
  includes = [],
  only_ids = false,
}: {
  includes?: string[];
  only_ids?: boolean;
}) => {
  const params = new URLSearchParams();
  for (const include of includes) {
    params.append(include, "true");
  }

  if (only_ids) params.append("only_ids", "true");
  const queryString = params.toString();
  const response = await axios.get(`/user-groups?${queryString}`);
  return response.data.user_groups;
};

export const useUserGroupsQuery = ({
  includes = [],
  only_ids = false,
}: {
  includes?: Array<"classroom" | "student">;
  only_ids?: boolean;
}) => {
  return useQuery({
    queryKey: [`user-groups`, { includes: includes, only_ids }],
    queryFn: () => getUserGroups({ includes, only_ids }),
  });
};

export const getUserGroupsByIds = async (ids: string[]) => {
  const response = await axios.get("/user-groups", {
    params: {
      ids,
      student: true,
      classroom: true,
    },
    paramsSerializer: {
      indexes: null,
    },
  });
  return response.data.user_groups;
};

export const useUserGroupsByIdsQuery = (ids: string[]) => {
  return useQuery({
    queryKey: ["user-groups", { ids }],
    queryFn: () => getUserGroupsByIds(ids),
    enabled: ids.length > 0,
  });
};

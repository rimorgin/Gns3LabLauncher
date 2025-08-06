import { useQuery } from "@tanstack/react-query";
import axios from "../axios";

export const getUserGroups = async ({
  includes = [],
  only_ids = false,
  by_classroom_only_id,
}: {
  includes?: string[];
  only_ids?: boolean;
  by_classroom_only_id?: string;
}) => {
  const params = new URLSearchParams();
  for (const include of includes) {
    params.append(include, "true");
  }
  if (by_classroom_only_id)
    params.append("by_classroom_only_id", by_classroom_only_id);
  if (only_ids) params.append("only_ids", "true");
  const queryString = params.toString();
  const response = await axios.get(`/user-groups?${queryString}`);
  return response.data.user_groups;
};

export const useUserGroupsQuery = ({
  includes = [],
  only_ids = false,
  by_classroom_only_id,
}: {
  includes?: Array<"classroom" | "student">;
  only_ids?: boolean;
  by_classroom_only_id?: string;
}) => {
  return useQuery({
    queryKey: [
      `user-groups`,
      { includes: includes.sort(), only_ids, by_classroom_only_id },
      includes,
    ],
    queryFn: () => getUserGroups({ includes, only_ids, by_classroom_only_id }),
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

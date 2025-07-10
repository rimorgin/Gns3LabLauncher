import { UserDbData } from "@clnt/lib/validators/user-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";
import { UserGroupFormData } from "@clnt/lib/validators/user-group-schema";

export const deleteUserGroup = async (ids: string | string[]) => {
  const idList = Array.isArray(ids) ? ids : [ids];

  if (idList.length === 1) {
    // For single delete, send ID as query param
    return (await axios.delete(`/user-groups/${idList[0]}`)).data;
  } else {
    // For multiple delete, send IDs as body
    return (
      await axios.delete("/user-groups/many", {
        data: { ids: idList },
      })
    ).data;
  }
};

export const useUserGroupDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserGroup,

    onMutate: async (ids: string | string[]) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUserGroups = queryClient.getQueryData<UserGroupFormData[]>([
        "user-groups",
      ]);

      const idsArray = Array.isArray(ids) ? ids : [ids];

      // Optimistic update
      queryClient.setQueryData(
        ["user-groups"],
        (old: UserDbData[] | undefined) =>
          Array.isArray(old)
            ? old.filter((user) => !idsArray.includes(user.id))
            : old,
      );

      return { previousUserGroups };
    },

    onError: (err, ids, context) => {
      if (context?.previousUserGroups) {
        queryClient.setQueryData(["user-groups"], context.previousUserGroups);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-groups"] });
    },
  });
};

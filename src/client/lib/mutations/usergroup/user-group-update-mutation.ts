import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";
import {
  UserGroupDbData,
  UserGroupFormData,
} from "@clnt/lib/validators/user-group-schema";

type UpdateUserGroupInput = {
  id: string;
  data: Partial<UserGroupFormData>;
};

export const patchUserGroup = async ({ id, data }: UpdateUserGroupInput) => {
  const response = await axios.patch(`/user-groups/${id}`, data);
  return response.data;
};

export const useUserGroupPatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchUserGroup,

    onMutate: async (updatedUserGroup: UpdateUserGroupInput) => {
      await queryClient.cancelQueries({ queryKey: ["user-groups"] });

      const previousUserGroups = queryClient.getQueryData<UserGroupDbData[]>([
        "user-groups",
      ]);

      queryClient.setQueryData<UserGroupDbData[]>(["user-groups"], (old) => {
        if (!Array.isArray(old)) return old;

        return old.map((item) =>
          item.id === updatedUserGroup.id
            ? { ...item, ...updatedUserGroup.data }
            : item,
        );
      });

      return { previousUserGroups };
    },

    onError: (err, variables, context) => {
      if (context?.previousUserGroups) {
        queryClient.setQueryData(["user-groups"], context.previousUserGroups);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-groups"] });
    },
  });
};

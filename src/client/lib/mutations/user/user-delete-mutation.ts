import { UserDbData } from "@clnt/lib/validators/user-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";

export const deleteUser = async (ids: string | string[]) => {
  const idList = Array.isArray(ids) ? ids : [ids];

  if (idList.length === 1) {
    // For single delete, send ID as query param
    return (await axios.delete(`/users/${idList[0]}`)).data;
  } else {
    // For multiple delete, send IDs as body
    return (
      await axios.delete("/users/many", {
        data: { ids: idList },
      })
    ).data;
  }
};

export const useUserDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onMutate: async (ids: string | string[]) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUsers = queryClient.getQueryData<UserDbData[]>(["users"]);

      const idsArray = Array.isArray(ids) ? ids : [ids];

      // Optimistic update
      queryClient.setQueryData(["users"], (old: UserDbData[] | undefined) =>
        Array.isArray(old)
          ? old.filter((user) => !idsArray.includes(user.id))
          : old,
      );

      return { previousUsers };
    },

    onError: (err, ids, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

import { UserEditData } from "@clnt/lib/validators/user-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@clnt/lib/axios";

export const patchUser = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<UserEditData>; // or whatever update shape you allow
}) => {
  const response = await axios.patch(`/users/${id}`, data);
  return response.data;
};

export const useUserPatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchUser,

    onMutate: async (updatedUser) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUsers = queryClient.getQueryData(["users"]);

      queryClient.setQueryData(["users"], (old: UserEditData) =>
        Array.isArray(old)
          ? old.map((item) =>
              item.id === updatedUser.id
                ? { ...item, ...updatedUser.data }
                : item,
            )
          : old,
      );

      return { previousUsers };
    },

    onError: (err, variables, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

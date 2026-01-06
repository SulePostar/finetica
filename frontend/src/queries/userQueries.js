import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, getUserById, updateUser } from "../api/users";

export const usersKeys = {
  all: ["users"],
  lists: () => [...usersKeys.all, "list"],
  list: (filters) => [...usersKeys.lists(), filters],
  detail: (id) => [...usersKeys.all, "detail", id],
};

export const useUsers = (filters = {}) => {
  return useQuery({
    queryKey: usersKeys.list(filters),
    queryFn: () => getUsers(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 1000
  });
};

export const useUser = (userId) => {
  return useQuery({
    queryKey: usersKeys.detail(userId),
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }) => updateUser({ id: userId, payload }),

    onMutate: async ({ userId, payload }) => {
      await queryClient.cancelQueries({ queryKey: usersKeys.lists() });

      const previousUsers = queryClient.getQueriesData({ queryKey: usersKeys.lists() });

      queryClient.setQueriesData(
        { queryKey: usersKeys.lists(), exact: false },
        (old) => {
          if (!old) return old;
          const isNested = !!old.data;
          const currentList = isNested ? old.data : old;

          const updatedList = currentList?.map((user) =>
            user.id === userId ? { ...user, ...payload } : user
          );

          return isNested ? { ...old, data: updatedList } : updatedList;
        }
      );
      return { previousUsers };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousUsers) {
        context.previousUsers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, getUserById, updateUser } from "../api/users";

export const usersKeys = {
  all: ["users"],
  list: (filters) => [...usersKeys.all, "list", filters],
  detail: (id) => [...usersKeys.all, "detail", id],
};


export const useUsers = (filters = {}) => {
  return useQuery({
    queryKey: usersKeys.list(filters),
    queryFn: () => getUsers(filters),
  });
};

export const useUser = (userId) => {
  return useQuery({
    queryKey: usersKeys.detail(userId),
    queryFn: () => getUserById(userId),
    enabled: !!userId
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }) =>
      updateUser(userId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
        exact: false
      });
    },
  });
};
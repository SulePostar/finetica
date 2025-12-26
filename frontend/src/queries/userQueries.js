import { useQuery } from "@tanstack/react-query";
import { getUsers, getUserById } from "../api/users";

export const usersKeys = {
  all: ["users"],
  list: (filters) => [...usersKeys.all, "list", filters],
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
    enabled: !!userId
  });
};


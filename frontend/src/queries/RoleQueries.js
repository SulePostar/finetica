import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoles } from "@/api/Roles";

export const userRoleKeys = {
  all: ["user-roles"],

  lists: () => [...userRoleKeys.all, "list"],
  list: (filters) => [...userRoleKeys.lists(), { filters }],
  details: () => [...userRoleKeys.all, "detail"],
  detail: (id) => [...userRoleKeys.details(), id],
};

// GET - list of user roles
export const useRoles = (filters = {}) => {
  return useQuery({
    queryKey: userRoleKeys.list(filters),
    queryFn: () => getRoles(filters),
    // Optional: enabled if you need to wait for some condition
    // enabled: !!someCondition,
  });
};
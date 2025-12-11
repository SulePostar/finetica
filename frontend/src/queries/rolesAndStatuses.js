import { getAllRoles, getAllStatuses, createRole } from "@/api/rolesAndStatuses";
import { useMutation, useQuery, useQueryClient, } from "@tanstack/react-query";

export const roleKeys = {
    all: ["roles"],
    lists: () => [...roleKeys.all, "list"],
    list: (filters) => [...roleKeys.lists(), { filters }],
};

export const statusKeys = {
    all: ["statuses"],
    lists: () => [...statusKeys.all, "list"],
    list: (filters) => [...statusKeys.lists(), { filters }],
};

export const useRoles = () => {
    return useQuery({
        queryKey: roleKeys.list(),
        queryFn: () =>
            getAllRoles(),
    });
};
export const useCreateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newRoleName) => createRole(newRoleName),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
        }
    })
}

export const useStatuses = () => {
    return useQuery({
        queryKey: statusKeys.list(),
        queryFn: () =>
            getAllStatuses(),
    });
};
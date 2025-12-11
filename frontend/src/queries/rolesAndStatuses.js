import { createUserStatus, getAllRoles, getAllStatuses } from "@/api/rolesAndStatuses";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

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

export const useStatuses = () => {
    return useQuery({
        queryKey: statusKeys.list(),
        queryFn: () =>
            getAllStatuses(),
    });
};

export const useCreateUserStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUserStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: statusKeys.lists() });
        },
    });
};
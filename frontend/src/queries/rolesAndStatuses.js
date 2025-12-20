import { getAllRoles, getAllStatuses, createRole, createUserStatus, deleteRole, deleteStatus } from "@/api/rolesAndStatuses";
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

export const useCreateUserStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUserStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: statusKeys.lists() });
        },
    });
};

export const useDeleteRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
        }
    })
}
export const useDeleteStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: statusKeys.lists() });
        }
    })
}
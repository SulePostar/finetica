import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUser } from "../api/users";

export const usersKeys = {
    all: ["users"],
    lists: () => [...usersKeys.all, "list"],
    list: (filters) => [...usersKeys.lists(), filters],
};


export const useUsers = (filters = {}) => {
    return useQuery({
        queryKey: usersKeys.list(filters),
        queryFn: () => getUsers(filters),
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUser,
        onMutate: async ({ id, ...updateData }) => {
            await queryClient.cancelQueries({ queryKey: usersKeys.lists() });
            const previousUsers = queryClient.getQueriesData({ queryKey: usersKeys.lists() });
            queryClient.setQueriesData({ queryKey: usersKeys.lists() }, (old) => {
                if (!old) {
                    return old;
                }
                return {
                    ...old,
                    data: old.data?.map(user =>
                        user.id === id ? { ...user, ...updateData } : user
                    ) || [],
                };
            });

            return { previousUsers };
        },
        onError: (err, variables, context) => {
            context.previousUsers.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data);
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
        },
    });
}
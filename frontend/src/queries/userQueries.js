import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/users";

export const usersKeys = {
    all: ["users"],
    list: (filters) => [...usersKeys.all, "list", filters],
};


export const useUsers = (filters = {}) => {
    return useQuery({
        queryKey: usersKeys.list(filters),
        queryFn: () => getUsers(filters),
    });
};


import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/users";

export const usersKeys = {
    all: ["users"],
    lists: () => [...usersKeys.all, "list"],
};


export const useUsers = () => {
    return useQuery({
        queryKey: usersKeys.lists(),
        queryFn: getUsers,
    });
};


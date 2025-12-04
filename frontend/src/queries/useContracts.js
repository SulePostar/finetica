import { useQuery } from "@tanstack/react-query";
import { getContracts } from "../api/contracts";

export const contractKeys = {
    all: ["contracts"],
    lists: () => [...contractKeys.all, "list"],
    list: (filters) => [...contractKeys.lists(), { filters }],
    details: () => [...contractKeys.all, "detail"],
    detail: (id) => [...contractKeys.details(), id],
};

export const useContracts = (filters = {}) => {
    return useQuery({
        queryKey: contractKeys.list(filters),
        queryFn: () => getContracts(),
    });
};

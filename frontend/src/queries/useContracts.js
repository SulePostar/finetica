import { useQuery } from "@tanstack/react-query";
import { getContracts, getContractById } from "../api/contracts";

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

export const useContractById = (id) => {
    return useQuery({
        queryKey: contractKeys.detail(id),
        queryFn: () => getContractById(id),
        enabled: !!id,
    });
};

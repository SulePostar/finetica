import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getKifItemById, getKifItems } from "@/api/Kif";

export const kifKeys = {
    all: ["kif-items"],
    lists: () => [...kifKeys.all, "list"],
    list: (filters) => [...kifKeys.lists(), { filters }],
    details: () => [...kifKeys.all, "detail"],
    detail: (id) => [...kifKeys.details(), id],
};

export const useKifItems = (filters = {}) => {
    return useQuery({
        queryKey: kifKeys.list(filters),
        queryFn: () => getKifItems(filters),
    });
};

export const useKifItem = (id) => {
    return useQuery({
        queryKey: kifKeys.detail(id),
        queryFn: () => getKifItemById(id),
        enabled: !!id,
    });
};
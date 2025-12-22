import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getKifById, getKifs } from "@/api/Kif";

export const kifKeys = {
    all: ["kif"],
    lists: () => [...kifKeys.all, "list"],
    list: (filters) => [...kifKeys.lists(), { filters }],
    details: () => [...kifKeys.all, "detail"],
    detail: (id) => [...kifKeys.details(), id],
};

export const useKifList = (filters = {}) => {
    return useQuery({
        queryKey: kifKeys.list(filters),
        queryFn: () => getKifs(filters),
    });
};

export const useKifById = (id) => {
    return useQuery({
        queryKey: kifKeys.detail(id),
        queryFn: () => getKifById(id),
        enabled: !!id,
    });
};
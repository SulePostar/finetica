import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getKifsById, getKifs } from "@/api/Kif";

export const kifKeys = {
    all: ["kif-items"],
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

export const useKifDetail = (id) => {
    return useQuery({
        queryKey: kifKeys.detail(id),
        queryFn: () => getKifsById(id),
        enabled: !!id,
    });
};
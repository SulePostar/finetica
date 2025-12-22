import { getAllKufs, getKufById } from "@/api/Kuf";
import { useQuery, } from "@tanstack/react-query";

export const kufKeys = {
    all: ["kuf"],
    lists: () => [...kufKeys.all, "list"],
    list: (filters) => [...kufKeys.lists(), { filters }],
    details: () => [...kufKeys.all, "detail"],
    detail: (id) => [...kufKeys.details(), id],
};

export const useKufInvoices = (filters = {}) => {
    return useQuery({
        queryKey: kufKeys.list(filters),
        queryFn: () =>
            getAllKufs(filters),
    });
};

export const useKufById = (id) => {
    return useQuery({
        queryKey: kufKeys.detail(id),
        queryFn: () => getKufById(id),
        enabled: !!id,
    });
}
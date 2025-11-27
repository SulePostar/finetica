import { getItems } from "@/api/Kuf";
import { useQuery, } from "@tanstack/react-query";

export const kufKeys = {
    all: ["kuf"],
    lists: () => [...kufKeys.all, "list"],
    list: (filters) => [...kufKeys.lists(), { filters }],
    details: () => [...kufKeys.all, "detail"],
    detail: (id) => [...kufKeys.details(), id],
};

// GET - list of items
export const useKufInvoices = (filters = {}) => {
    return useQuery({
        queryKey: kufKeys.list(filters),
        queryFn: () =>
            getItems(filters),
    });
};
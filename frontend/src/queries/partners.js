import { getAllPartners } from "@/api/partners";
import { useQuery } from "@tanstack/react-query";

export const partnerKeys = {
    all: ["example-items"],
    lists: () => [...partnerKeys.all, "list"],
    list: (filters) => [...partnerKeys.lists(), { filters }],
};

export const usePartners = (filters = {}) => {
    return useQuery({
        queryKey: partnerKeys.list(filters),
        queryFn: () =>
            getAllPartners(filters)
    });
}
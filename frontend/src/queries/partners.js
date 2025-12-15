import { getAllPartners } from "@/api/partners";
import { useQuery } from "@tanstack/react-query";

export const partnersKeys = {
    all: ["partners"],
    lists: () => [...partnersKeys.all, "list"],
    list: (filters) => [...partnersKeys.lists(), { filters }],
};

export const usePartners = (filters = {}) => {
    return useQuery({
        queryKey: partnersKeys.list(filters),
        queryFn: () =>
            getAllPartners(filters)
    });
}
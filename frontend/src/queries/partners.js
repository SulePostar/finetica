import { getAllPartners, getPartnerById, deletePartner } from "@/api/partners";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

export const usePartnerById = (id) => {
    return useQuery({
        queryKey: [...partnersKeys.all, "detail", id],
        queryFn: () => getPartnerById(id),
        enabled: !!id,
    });
}
export const useDeletePartner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePartner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: partnersKeys.lists() });
        },
    });
};
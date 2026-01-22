import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFaqs, deleteFaq, createFaq } from "@/api/faqs";

export const faqKeys = {
    all: ["faq"],
    lists: () => [...faqKeys.all, "list"],
};

export const useFaqList = () => {
    return useQuery({
        queryKey: faqKeys.lists(),
        queryFn: getFaqs,
        staleTime: 10 * 60 * 1000,
        keepPreviousData: true,
    });
};

export const useCreateFaq = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createFaq,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
        },

    })
};

export const useDeleteFaq = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteFaq,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
        }
    })
};  

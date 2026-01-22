import { useQuery } from "@tanstack/react-query";
import { getFaqs } from "@/api/faqs";

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
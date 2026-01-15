import { useQuery } from "@tanstack/react-query";
import { getFaqs } from "@/api/faqs";

// Define keys following your existing pattern
export const faqKeys = {
    all: ["faq"],
    lists: () => [...faqKeys.all, "list"],
};

export const useFaqList = () => {
    return useQuery({
        queryKey: faqKeys.lists(),
        queryFn: getFaqs,
        staleTime: 10 * 60 * 1000, // Cache for 10 mins since FAQs are static
        keepPreviousData: true,
    });
};
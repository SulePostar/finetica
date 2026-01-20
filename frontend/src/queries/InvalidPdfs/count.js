import { useQuery } from "@tanstack/react-query";
import { getInvalidPdfsCount } from "@/api/invalidPdf";
import { invalidPdfsKeys } from "./keys";

export const useInvalidPdfsCount = () => {
    return useQuery({
        queryKey: [...invalidPdfsKeys.all, "count"],
        queryFn: () => getInvalidPdfsCount(),
        select: (data) => {
            if (!data) return undefined; // Let error propagate
            return data?.total ?? 0;
        },
        staleTime: 30 * 1000, // 30 seconds
        cacheTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
        refetchOnWindowFocus: false, // Don't refetch on window focus for dashboard
    });
};

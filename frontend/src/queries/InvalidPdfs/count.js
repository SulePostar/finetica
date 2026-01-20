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
    });
};

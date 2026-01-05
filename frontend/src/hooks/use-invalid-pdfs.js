import { useQuery } from "@tanstack/react-query";
import { invalidPdfsKeys } from "@/queries/InvalidPdfs/keys";
import { invalidPdfsFetchers } from "@/queries/InvalidPdfs/fetchers";

export function useInvalidPdfs(activeTab, page = 1, limit = 10, shouldPoll = false) {
  return useQuery({
    queryKey: invalidPdfsKeys.list(activeTab, page, limit),

    queryFn: async () => {
      const fn = invalidPdfsFetchers[activeTab];
      if (!fn) return { data: [], total: 0 }; // prevents "undefined is not a function"
      return fn(page, limit);
    },

    placeholderData: (prev) => prev,

    refetchInterval: () => (shouldPoll ? 2000 : false),
    refetchIntervalInBackground: false,
  });
}

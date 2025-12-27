import { useQuery } from "@tanstack/react-query";
import { getBankStatementsInvalidPdfs } from "@/api/BankTransactions";

export function useInvalidPdfs(activeTab, page = 1, perPage = 10) {
  const queryKey = ["invalid-pdfs", activeTab, page, perPage];

  const fetchers = {
    bank: (p, l) => getBankStatementsInvalidPdfs(p, l),
    kif: (p, l) => getBankStatementsInvalidPdfs(p, l),
    kuf: (p, l) => getBankStatementsInvalidPdfs(p, l),
    contracts: (p, l) => getBankStatementsInvalidPdfs(p, l),
  };

  const queryFn = async () => {
    const fn = fetchers[activeTab] ?? (() => Promise.resolve({ data: [], total: 0 }));
    return await fn(page, perPage);
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn,
    keepPreviousData: true,
    staleTime: 60_000,
  });

  return { data: data ?? { data: [], total: 0 }, isLoading, isError, error, refetch };
}
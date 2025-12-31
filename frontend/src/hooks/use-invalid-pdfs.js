import { useQuery } from "@tanstack/react-query";
import { getBankStatementsInvalidPdfs } from "@/api/BankTransactions";
import { getContractsInvalidPdfs } from "@/api/contracts";
import { getKifInvalidPdfs } from "@/api/Kif";
import { getKufInvalidPdfs } from "@/api/Kuf";

export function useInvalidPdfs(activeTab, page = 1, limit = 10) {
  const queryKey = ["invalid-pdfs", activeTab, page, limit];

  const fetchers = {
    bank: (p, l) => getBankStatementsInvalidPdfs(p, l),
    kif: (p, l) => getKifInvalidPdfs(p, l),
    kuf: (p, l) => getKufInvalidPdfs(p, l),
    contracts: (p, l) => getContractsInvalidPdfs(p, l),
  };

  const queryFn = async () => {
    const fn = fetchers[activeTab] ?? (() => Promise.resolve({ data: [], total: 0 }));
    const res = await fn(page, limit);
    return res;
  };

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey,
    queryFn,
    placeholderData: (previousData) => previousData,
    staleTime: 60_000,
  });

  return { data, isPending, isError, error, refetch };
}
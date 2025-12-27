import { useQuery } from "@tanstack/react-query";
import { getBankStatementsInvalidPdfs } from "@/api/BankTransactions";
import { getContractsInvalidPdfs } from "@/api/contracts";
import { getKifInvalidPdfs } from "@/api/Kif";
import { getKufInvalidPdfs } from "@/api/Kuf";

export function useInvalidPdfs(activeTab, page = 1, perPage = 10) {
  const queryKey = ["invalid-pdfs", activeTab, page, perPage];

  const fetchers = {
    bank: (p, l) => getBankStatementsInvalidPdfs(p, l),
    kif: (p, l) => getKifInvalidPdfs(p, l),
    kuf: (p, l) => getKufInvalidPdfs(p, l),
    contracts: (p, l) => getContractsInvalidPdfs(p, l),
  };

  const queryFn = async () => {
    console.log("fetching invalid pdfs for tab:", activeTab, "page:", page);
    const fn = fetchers[activeTab] ?? (() => Promise.resolve({ data: [], total: 0 }));
    const res = await fn(page, perPage);
    console.log("fetch result:", res);
    return res;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn,
    keepPreviousData: true,
    staleTime: 60_000,
  });

  return { data, isLoading, isError, error, refetch };
}
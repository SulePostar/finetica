import { useQuery } from "@tanstack/react-query";
import { getContracts, getContractById, getContractInvalidPdfById, getContractsInvalidPdfs } from "../api/contracts";

export const contractKeys = {
    all: ["contracts"],
    lists: () => [...contractKeys.all, "list"],
    list: ({ page = 1, perPage = 10, timeRange = null }) => [
      ...contractKeys.lists(),
      page,
      perPage,
      timeRange === null ? "all" : (typeof timeRange === 'object' ? JSON.stringify(timeRange) : timeRange),
    ],
    details: () => [...contractKeys.all, "detail"],
    detail: (id) => [...contractKeys.details(), id],
};

export const useContracts = ({ page = 1, perPage = 10, timeRange = null } = {}) => {
    return useQuery({
      queryKey: contractKeys.list({ page, perPage, timeRange }),
      queryFn: () => getContracts({ page, perPage, timeRange }),
    });
};

export const useContractById = (id) => {
    return useQuery({
        queryKey: contractKeys.detail(id),
        queryFn: () => getContractById(id),
        enabled: !!id,
    });
};

/* -------------------- */
/*     Invalid PDFs     */
/* -------------------- */
export const useContractInvalidPdfs = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: [...contractKeys.all, "invalid-pdfs", { page, limit }],
        queryFn: () => getContractsInvalidPdfs(page, limit),
    });
}

export const useContractInvalidPdfById = (id) => {
    return useQuery({
        queryKey: [...contractKeys.all, "invalid-pdfs", "detail", id],
        queryFn: () => getContractInvalidPdfById(id),
        enabled: !!id,
    });
}
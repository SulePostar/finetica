import { useQuery } from "@tanstack/react-query";
import { getContracts, getContractById, getContractInvalidPdfById, getContractsInvalidPdfs } from "../api/contracts";

export const contractKeys = {
    all: ["contracts"],
    lists: () => [...contractKeys.all, "list"],
    list: (filters) => [...contractKeys.lists(), { filters }],
    details: () => [...contractKeys.all, "detail"],
    detail: (id) => [...contractKeys.details(), id],
};

export const useContracts = (filters = {}) => {
    return useQuery({
        queryKey: contractKeys.list(filters),
        queryFn: () => getContracts(filters),
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
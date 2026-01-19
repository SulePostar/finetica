import { useQuery } from "@tanstack/react-query";
import { getKifById, getKifs, getKifInvalidPdfById, getKifInvalidPdfs, getKifInvoiceTypes } from "@/api/Kif";

export const kifKeys = {
    all: ["kif"],
    lists: () => [...kifKeys.all, "list"],
    list: (filters) => [...kifKeys.lists(), { filters }],
    details: () => [...kifKeys.all, "detail"],
    detail: (id) => [...kifKeys.details(), id],
    invoiceTypes: () => [...kifKeys.all, "invoice-types"],
};

export const useKifList = (filters = {}) => {
    return useQuery({
        queryKey: kifKeys.list(filters),
        queryFn: () => getKifs(filters),
    });
};

export const useKifById = (id) => {
    return useQuery({
        queryKey: kifKeys.detail(id),
        queryFn: () => getKifById(id),
        enabled: !!id,
    });
};

export const useKifInvoiceTypes = () => {
    return useQuery({
        queryKey: kifKeys.invoiceTypes(),
        queryFn: getKifInvoiceTypes,
        staleTime: 5 * 60 * 1000,
    });
};

/* -------------------- */
/*     Invalid PDFs     */
/* -------------------- */
export const useKifInvalidPdfs = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: [...kifKeys.all, "invalid-pdfs", { page, limit }],
        queryFn: () => getKifInvalidPdfs(page, limit),
    });
}

export const useKifInvalidPdfById = (id) => {
    return useQuery({
        queryKey: [...kifKeys.all, "invalid-pdfs", "detail", id],
        queryFn: () => getKifInvalidPdfById(id),
        enabled: !!id,
    });
}
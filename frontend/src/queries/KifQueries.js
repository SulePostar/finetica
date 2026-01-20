import { useQuery } from "@tanstack/react-query";
import { getKifById, getKifs, getKifInvalidPdfById, getKifInvalidPdfs, getKifInvoiceTypes } from "@/api/Kif";

export const kifKeys = {
    all: ["kif"],
    lists: () => [...kifKeys.all, "list"],
    list: ({ page = 1, perPage = 10, invoiceType = null, timeRange = null }) => [
        ...kifKeys.lists(),
        page,
        perPage,
        invoiceType ?? "all",
        timeRange === null ? "all" : (typeof timeRange === 'object' ? JSON.stringify(timeRange) : timeRange),
    ],
    details: () => [...kifKeys.all, "detail"],
    detail: (id) => [...kifKeys.details(), id],
    invoiceTypes: () => [...kifKeys.all, "invoice-types"],
};

export const useKifList = ({ page = 1, perPage = 10, invoiceType = null, timeRange = null } = {}) => {
    return useQuery({
        queryKey: kifKeys.list({ page, perPage, invoiceType, timeRange }),
        queryFn: () => getKifs({ page, perPage, invoiceType, timeRange }),
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
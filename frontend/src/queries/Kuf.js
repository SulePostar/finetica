import { getAllKufs, getKufById, getKufInvalidPdfs, getKufInvalidPdfById, getKufInvoiceTypes } from "@/api/Kuf";
import { useQuery, } from "@tanstack/react-query";

export const kufKeys = {
    all: ["kuf"],
    lists: () => [...kufKeys.all, "list"],
    list: (filters) => [...kufKeys.lists(), { filters }],
    details: () => [...kufKeys.all, "detail"],
    detail: (id) => [...kufKeys.details(), id],
    invoiceTypes: () => [...kufKeys.all, "invoice-types"],
};

export const useKufInvoices = (filters = {}) => {
    return useQuery({
        queryKey: kufKeys.list(filters),
        queryFn: () =>
            getAllKufs(filters),
    });
};

export const useKufById = (id) => {
    return useQuery({
        queryKey: kufKeys.detail(id),
        queryFn: () => getKufById(id),
        enabled: !!id,
    });
}

export const useKufInvoiceTypes = () => {
    return useQuery({
        queryKey: kufKeys.invoiceTypes(),
        queryFn: () => getKufInvoiceTypes(),
    });
}

/* -------------------- */
/*     Invalid PDFs     */
/* -------------------- */
export const useKufInvalidPdfs = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: [...kufKeys.all, "invalid-pdfs", { page, limit }],
        queryFn: () => getKufInvalidPdfs(page, limit),
    });
}

export const useKufInvalidPdfById = (id) => {
    return useQuery({
        queryKey: [...kufKeys.all, "invalid-pdfs", "detail", id],
        queryFn: () => getKufInvalidPdfById(id),
        enabled: !!id,
    });
}
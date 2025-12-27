import { useQuery } from "@tanstack/react-query";
import { getKifById, getKifs, getKifInvalidPdfById, getKifInvalidPdfs } from "@/api/Kif";

export const kifKeys = {
    all: ["kif"],
    lists: () => [...kifKeys.all, "list"],
    list: (filters) => [...kifKeys.lists(), { filters }],
    details: () => [...kifKeys.all, "detail"],
    detail: (id) => [...kifKeys.details(), id],
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
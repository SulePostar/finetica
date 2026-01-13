import { useMemo } from "react";

export const useDocumentType = (rawDocumentType) =>
    useMemo(() => {
        if (!rawDocumentType) return null;

        if (rawDocumentType === "kif" || rawDocumentType === "kuf") {
            return rawDocumentType;
        }

        if (
            rawDocumentType === "bank-statements" ||
            rawDocumentType === "bank-transactions"
        ) {
            return "bank-transactions";
        }

        return null;
    }, [rawDocumentType]);

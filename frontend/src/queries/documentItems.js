import { useQuery } from "@tanstack/react-query";
import { getDocumentItems } from "../api/documentItems";

export const documentItemsKeys = (type, id) => [
    "document-items",
    type,
    id,
];

export function useDocumentItems(type, id) {
    return useQuery({
        queryKey: documentItemsKeys(type, id),
        queryFn: () => getDocumentItems(type, id),
        enabled: Boolean(type && id),
    });
}
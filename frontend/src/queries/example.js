// Example Query file
// This is how we should define ALL future useQuery/useMutation hooks.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getItems, createItem, deleteItem } from "../api/example";

// GET list of items
export const useExampleItems = () => {
    return useQuery({
        queryKey: ["example-items"],
        queryFn: getItems,
    });
};

// CREATE item
export const useCreateExampleItem = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createItem,
        onSuccess: () => {
            qc.invalidateQueries(["example-items"]);
        },
    });
};

// DELETE item
export const useDeleteExampleItem = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteItem,
        onSuccess: () => {
            qc.invalidateQueries(["example-items"]);
        },
    });
};
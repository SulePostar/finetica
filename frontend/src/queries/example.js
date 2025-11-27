// Example Query file
// This is how we should define ALL future useQuery/useMutation hooks.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getItems, getItemById, createItem, updateItem, deleteItem } from "../api/example";

// Query keys factory - centralized query keys management
export const exampleKeys = {
    all: ["example-items"],
    lists: () => [...exampleKeys.all, "list"],
    list: (filters) => [...exampleKeys.lists(), { filters }],
    details: () => [...exampleKeys.all, "detail"],
    detail: (id) => [...exampleKeys.details(), id],
};

// GET - list of items
export const useExampleItems = (filters = {}) => {
    return useQuery({
        queryKey: exampleKeys.list(filters),
        queryFn: () => getItems(filters),
        // Optional: enabled if you need to wait for some condition
        // enabled: !!someCondition,
    });
};

// GET - single item by ID
export const useExampleItem = (id) => {
    return useQuery({
        queryKey: exampleKeys.detail(id),
        queryFn: () => getItemById(id),
        enabled: !!id, // Don't run query if no ID
    });
};

// CREATE - new item
export const useCreateExampleItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createItem,
        onSuccess: () => {
            // Invalidate list queries to refresh the list
            queryClient.invalidateQueries({ queryKey: exampleKeys.lists() });
        },
        // Optional: optimistic update
        // onMutate: async (newItem) => {
        //     await queryClient.cancelQueries({ queryKey: exampleKeys.lists() });
        //     const previousItems = queryClient.getQueryData(exampleKeys.lists());
        //     queryClient.setQueryData(exampleKeys.lists(), (old) => [...old, newItem]);
        //     return { previousItems };
        // },
        // onError: (err, newItem, context) => {
        //     queryClient.setQueryData(exampleKeys.lists(), context.previousItems);
        // },
    });
};

// UPDATE - existing item
export const useUpdateExampleItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateItem,
        onSuccess: (data, variables) => {
            // Update cache for single item
            queryClient.setQueryData(exampleKeys.detail(variables.id), data);
            // Invalidate list queries
            queryClient.invalidateQueries({ queryKey: exampleKeys.lists() });
        },
    });
};

// DELETE - item by ID
export const useDeleteExampleItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteItem,
        onSuccess: (_, deletedId) => {
            // Remove item from cache
            queryClient.removeQueries({ queryKey: exampleKeys.detail(deletedId) });
            // Invalidate list queries
            queryClient.invalidateQueries({ queryKey: exampleKeys.lists() });
        },
    });
};
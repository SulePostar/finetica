import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPendingEntries, approveEntry, rejectEntry } from '@/api/knowledgebase';
export const QUERY_KEY = ['pending-knowledge-base'];


export const usePendingEntries = () => {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: fetchPendingEntries,
    });
};

export const useApproveEntry = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: approveEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: (error) => {
            console.error("Failed to approve:", error);
            alert("Error");
        }
    });
};

export const useRejectEntry = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rejectEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: (error) => {
            console.error("Failed to reject:", error);
            alert("Error deleting file");
        }
    });
};
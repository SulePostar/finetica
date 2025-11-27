import { QueryClient } from '@tanstack/react-query';

// QueryClient configuration with default options
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Retry 3 times if query fails
            retry: 3,
            // Retry delay increases exponentially
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Stale time - how long data is considered "fresh"
            staleTime: 5 * 60 * 1000, // 5 minutes
            // Cache time - how long data is kept in cache after it's no longer in use
            gcTime: 10 * 60 * 1000, // 10 minutes (previously called cacheTime)
            // Refetch on window focus
            refetchOnWindowFocus: true,
            // Refetch on reconnect
            refetchOnReconnect: true,
            // Don't refetch on mount if data is fresh
            refetchOnMount: true,
        },
        mutations: {
            // Retry mutations only once
            retry: 1,
        },
    },
});


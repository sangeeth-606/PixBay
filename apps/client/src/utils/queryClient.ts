
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30,   // 30 minutes — REPLACES `cacheTime` in v5+
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export { QueryClientProvider };

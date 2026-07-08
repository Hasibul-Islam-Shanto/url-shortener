import { QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { NormalizedApiError } from '@/types/api';
import { authKeys } from '@/features/auth/api/queryKeys';

function isSessionExpiry(queryKey: readonly unknown[], error: NormalizedApiError) {
  return error.isUnauthorized && queryKey[0] !== 'auth';
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const normalized = error as NormalizedApiError;
      if (isSessionExpiry(query.queryKey, normalized)) {
        queryClient.setQueryData(authKeys.me, null);
        toast.error('Your session has expired. Please log in again.');
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const normalized = error as NormalizedApiError;
        if (normalized.statusCode >= 400 && normalized.statusCode < 500) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        const normalized = error as NormalizedApiError;
        if (normalized.isUnauthorized) {
          queryClient.setQueryData(authKeys.me, null);
        }
      },
    },
  },
});

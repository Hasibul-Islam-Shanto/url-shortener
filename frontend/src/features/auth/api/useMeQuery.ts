import { useQuery } from '@tanstack/react-query';
import * as authService from '@/services/auth.service';
import type { NormalizedApiError } from '@/types/api';
import { authKeys } from './queryKeys';

export function useMeQuery() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      try {
        return await authService.getMe();
      } catch (error) {
        if ((error as NormalizedApiError).isUnauthorized) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}

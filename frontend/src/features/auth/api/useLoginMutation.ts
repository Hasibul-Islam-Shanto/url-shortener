import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as authService from '@/services/auth.service';
import { authKeys } from './queryKeys';

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me, user);
    },
  });
}

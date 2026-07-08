import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as authService from '@/services/auth.service';
import { authKeys } from './queryKeys';

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me, user);
    },
  });
}

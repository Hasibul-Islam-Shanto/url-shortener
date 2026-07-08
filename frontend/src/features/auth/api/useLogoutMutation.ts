import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as authService from '@/services/auth.service';
import { authKeys } from './queryKeys';

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.me, null);
      queryClient.removeQueries({ queryKey: ['urls'] });
      queryClient.removeQueries({ queryKey: ['dashboard'] });
    },
  });
}

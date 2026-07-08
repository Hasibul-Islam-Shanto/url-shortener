import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as authService from '@/services/auth.service';
import { authKeys } from '@/features/auth/api/queryKeys';

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me, user);
    },
  });
}

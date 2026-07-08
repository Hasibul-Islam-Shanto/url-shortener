import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as urlService from '@/services/url.service';
import { urlKeys } from './queryKeys';

export function useCreateUrlMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: urlService.createUrl,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...urlKeys.all, 'list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as urlService from '@/services/url.service';
import type { UpdateUrlPayload } from '../types';
import { urlKeys } from './queryKeys';

export function useUpdateUrlMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUrlPayload) => urlService.updateUrl(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...urlKeys.all, 'list'] });
      queryClient.invalidateQueries({ queryKey: urlKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as urlService from '@/services/url.service';
import { urlKeys } from './queryKeys';

export function useDeleteUrlMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => urlService.deleteUrl(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: [...urlKeys.all, 'list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.removeQueries({ queryKey: urlKeys.detail(id) });
      queryClient.removeQueries({ queryKey: [...urlKeys.all, 'analytics', id] });
    },
  });
}

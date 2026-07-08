import { useQuery } from '@tanstack/react-query';
import * as urlService from '@/services/url.service';
import { urlKeys } from './queryKeys';

export function useUrlDetailQuery(id: string) {
  return useQuery({
    queryKey: urlKeys.detail(id),
    queryFn: () => urlService.getUrl(id),
    enabled: !!id,
  });
}

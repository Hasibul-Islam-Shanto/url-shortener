import { useQuery } from '@tanstack/react-query';
import * as urlService from '@/services/url.service';
import { urlKeys } from './queryKeys';
import type { UrlListParams } from '../types';

export function useUrlListQuery(params: UrlListParams) {
  return useQuery({
    queryKey: urlKeys.list(params),
    queryFn: () => urlService.listUrls(params),
    placeholderData: (previousData) => previousData,
  });
}

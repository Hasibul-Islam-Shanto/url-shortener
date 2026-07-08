import { useQuery } from '@tanstack/react-query';
import * as analyticsService from '@/services/analytics.service';
import { urlKeys } from '@/features/urls/api/queryKeys';

export function useUrlAnalyticsQuery(id: string, params: { page: number; limit: number }) {
  return useQuery({
    queryKey: urlKeys.analytics(id, params),
    queryFn: () => analyticsService.getUrlAnalytics(id, params),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
  });
}

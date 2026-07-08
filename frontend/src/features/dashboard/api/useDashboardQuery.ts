import { useQuery } from '@tanstack/react-query';
import * as dashboardService from '@/services/dashboard.service';

export function useDashboardQuery() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboardStats,
  });
}

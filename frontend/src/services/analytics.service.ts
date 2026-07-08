import { axiosClient } from '@/api/axiosClient';
import type { ApiSuccessResponse, Pagination } from '@/types/api';
import type { UrlAnalytics } from '@/features/analytics/types';

export async function getUrlAnalytics(id: string, params: { page: number; limit: number }) {
  const res = await axiosClient.get<
    ApiSuccessResponse<{ summary: UrlAnalytics['summary']; recentVisits: UrlAnalytics['recentVisits']; pagination: Pagination }>
  >(`/api/urls/${id}/analytics`, { params });
  return res.data.data;
}

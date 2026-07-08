import { axiosClient } from '@/api/axiosClient';
import type { ApiSuccessResponse } from '@/types/api';
import type { DashboardStats } from '@/features/dashboard/types';

export async function getDashboardStats() {
  const res = await axiosClient.get<ApiSuccessResponse<DashboardStats>>('/api/dashboard');
  return res.data.data;
}

import { axiosClient } from '@/api/axiosClient';
import type { ApiSuccessResponse, Pagination } from '@/types/api';
import type { CreateUrlPayload, UpdateUrlPayload, Url, UrlListParams } from '@/features/urls/types';

export async function createUrl(payload: CreateUrlPayload) {
  const res = await axiosClient.post<ApiSuccessResponse<{ url: Url }>>('/api/urls', payload);
  return res.data.data.url;
}

export async function listUrls(params: UrlListParams) {
  const res = await axiosClient.get<ApiSuccessResponse<{ urls: Url[]; pagination: Pagination }>>(
    '/api/urls',
    { params }
  );
  return res.data.data;
}

export async function getUrl(id: string) {
  const res = await axiosClient.get<ApiSuccessResponse<{ url: Url }>>(`/api/urls/${id}`);
  return res.data.data.url;
}

export async function updateUrl(id: string, payload: UpdateUrlPayload) {
  const res = await axiosClient.patch<ApiSuccessResponse<{ url: Url }>>(`/api/urls/${id}`, payload);
  return res.data.data.url;
}

export async function deleteUrl(id: string) {
  await axiosClient.delete(`/api/urls/${id}`);
}

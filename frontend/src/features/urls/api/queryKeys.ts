import type { UrlListParams } from '../types';

export const urlKeys = {
  all: ['urls'] as const,
  list: (params: UrlListParams) => ['urls', 'list', params] as const,
  detail: (id: string) => ['urls', 'detail', id] as const,
  analytics: (id: string, params: { page: number; limit: number }) =>
    ['urls', 'analytics', id, params] as const,
};

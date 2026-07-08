import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import type { UrlListParams, UrlStatus } from '../types';

type ParamPatch = Partial<{
  page: number;
  limit: number;
  sort: string;
  status: UrlStatus | '';
  search: string;
}>;

export function useUrlListParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params: UrlListParams = {
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || DEFAULT_PAGE_SIZE,
    sort: (searchParams.get('sort') as UrlListParams['sort']) || 'createdAt:desc',
    status: (searchParams.get('status') as UrlStatus) || undefined,
    search: searchParams.get('search') || undefined,
  };

  function setParam(patch: ParamPatch) {
    const next = new URLSearchParams(searchParams);
    const shouldResetPage = ('search' in patch || 'status' in patch || 'sort' in patch) && !('page' in patch);

    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined || value === '') {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    }

    if (shouldResetPage) {
      next.set('page', '1');
    }

    setSearchParams(next);
  }

  return { params, setParam };
}

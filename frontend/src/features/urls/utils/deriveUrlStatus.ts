import type { Url, UrlStatus } from '../types';

export function deriveUrlStatus(url: Pick<Url, 'isActive' | 'expiresAt'>): UrlStatus {
  if (!url.isActive) return 'disabled';
  if (url.expiresAt && new Date(url.expiresAt).getTime() <= Date.now()) return 'expired';
  return 'active';
}

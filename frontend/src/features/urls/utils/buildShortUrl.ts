import { PUBLIC_BASE_URL } from '@/utils/constants';

export function buildShortUrl(shortCode: string) {
  return `${PUBLIC_BASE_URL}/${shortCode}`;
}

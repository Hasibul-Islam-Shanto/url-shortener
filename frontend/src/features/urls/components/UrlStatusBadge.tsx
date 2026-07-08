import { Badge } from '@/components/ui/Badge';
import { deriveUrlStatus } from '../utils/deriveUrlStatus';
import type { Url } from '../types';

const VARIANT_BY_STATUS = {
  active: 'success',
  disabled: 'neutral',
  expired: 'warning',
} as const;

const LABEL_BY_STATUS = {
  active: 'Active',
  disabled: 'Disabled',
  expired: 'Expired',
} as const;

export function UrlStatusBadge({ url }: { url: Pick<Url, 'isActive' | 'expiresAt'> }) {
  const status = deriveUrlStatus(url);
  return <Badge variant={VARIANT_BY_STATUS[status]}>{LABEL_BY_STATUS[status]}</Badge>;
}

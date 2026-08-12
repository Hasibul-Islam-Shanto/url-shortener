import { Badge } from '@/components/ui/Badge';
import { deriveUrlStatus } from '../utils/deriveUrlStatus';
import type { Url } from '../types';
import { cn } from '@/utils/cn';

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

const GLOW_BY_STATUS = {
  active: 'shadow-glow-green',
  disabled: 'shadow-glow-gray',
  expired: 'shadow-glow-amber',
} as const;

export function UrlStatusBadge({ url }: { url: Pick<Url, 'isActive' | 'expiresAt'> }) {
  const status = deriveUrlStatus(url);
  return (
    <Badge variant={VARIANT_BY_STATUS[status]} className={cn(GLOW_BY_STATUS[status])}>
      {LABEL_BY_STATUS[status]}
    </Badge>
  );
}

import { deriveUrlStatus } from '../utils/deriveUrlStatus';
import type { Url } from '../types';
import { cn } from '@/utils/cn';

const STATUS_LABEL = {
  active: 'Active',
  disabled: 'Disabled',
  expired: 'Expired',
} as const;

const STATUS_STYLE = {
  active: 'bg-status-active shadow-[0_0_8px_rgba(16,185,129,0.35)]',
  disabled: 'bg-slate-500 shadow-glowSm',
  expired: 'bg-slate-400 shadow-glowSm',
} as const;

export function StatusDot({ url }: { url: Pick<Url, 'isActive' | 'expiresAt'> }) {
  const status = deriveUrlStatus(url);

  return (
    <span
      className={cn('inline-block h-2 w-2 shrink-0 rounded-full', STATUS_STYLE[status])}
      title={STATUS_LABEL[status]}
      aria-label={STATUS_LABEL[status]}
    />
  );
}

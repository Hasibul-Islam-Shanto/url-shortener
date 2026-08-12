import type { LucideIcon } from 'lucide-react';
import { Link2, MousePointerClick, CheckCircle2 } from 'lucide-react';
import { deriveUrlStatus } from '../utils/deriveUrlStatus';
import type { Url } from '../types';
import type { Pagination } from '@/types/api';
import { cn } from '@/utils/cn';

interface UrlListStatsProps {
  urls: Url[];
  pagination: Pagination;
}

interface StatItem {
  label: string;
  value: number;
  icon: LucideIcon;
  glowClass: string;
  iconClass: string;
}

export function UrlListStats({ urls, pagination }: UrlListStatsProps) {
  const totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0);
  const activeLinks = urls.filter((url) => deriveUrlStatus(url) === 'active').length;

  const stats: StatItem[] = [
    {
      label: 'Total Links',
      value: pagination.total,
      icon: Link2,
      glowClass: 'shadow-glowSm',
      iconClass: 'text-indigo-400',
    },
    {
      label: 'Total Clicks',
      value: totalClicks,
      icon: MousePointerClick,
      glowClass: 'shadow-glowSm',
      iconClass: 'text-purple-400',
    },
    {
      label: 'Active Links',
      value: activeLinks,
      icon: CheckCircle2,
      glowClass: 'shadow-glow-green',
      iconClass: 'text-green-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map(({ label, value, icon: Icon, glowClass, iconClass }) => (
        <div
          key={label}
          className={cn(
            'rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-200',
            glowClass
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-slate-400">{label}</p>
            <Icon className={cn('h-4 w-4', iconClass)} />
          </div>
          <p className="text-2xl font-semibold text-gray-100">{value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

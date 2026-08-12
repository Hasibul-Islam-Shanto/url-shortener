import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-glass-border bg-glass px-6 py-12 text-center shadow-glowCard backdrop-blur-lg">
      <div className="text-slate-400">{icon ?? <Inbox className="h-8 w-8" />}</div>
      <div>
        <p className="text-sm font-medium text-slate-100">{title}</p>
        {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}

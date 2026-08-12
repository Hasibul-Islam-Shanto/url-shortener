import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm',
  {
    variants: {
      variant: {
        neutral: 'border border-glass-border bg-glass text-slate-300',
        success: 'border border-status-active/20 bg-status-active/15 text-status-active',
        warning: 'border border-glass-border bg-glass text-slate-400',
        danger: 'border border-red-500/20 bg-red-500/15 text-red-400',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

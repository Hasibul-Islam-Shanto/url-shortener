import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'h-10 w-full rounded-xl border bg-glass px-3 text-sm text-slate-100 backdrop-blur-md placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-start/50 focus:shadow-glowSm disabled:cursor-not-allowed disabled:opacity-50',
          invalid
            ? 'border-red-500/70 focus:ring-red-400/50'
            : 'border-glass-border',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

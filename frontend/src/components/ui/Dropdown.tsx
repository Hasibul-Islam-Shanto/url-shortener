import type { ReactNode } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@/utils/cn';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
}

export function Dropdown({ trigger, children, align = 'end' }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={4}
          className="z-50 min-w-[10rem] rounded-2xl border border-glass-border bg-bg-base/95 p-1 shadow-glowCard backdrop-blur-lg"
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

interface DropdownItemProps {
  onSelect?: () => void;
  children: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
}

export function DropdownItem({ onSelect, children, destructive, disabled }: DropdownItemProps) {
  return (
    <DropdownMenu.Item
      onSelect={onSelect}
      disabled={disabled}
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none transition-all duration-200 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        destructive
          ? 'text-red-400 focus:bg-red-900/30'
          : 'text-slate-200 focus:bg-white/[0.08] focus:shadow-glowSm'
      )}
    >
      {children}
    </DropdownMenu.Item>
  );
}

import { forwardRef, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { cn } from '@/utils/cn';

interface SearchInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ id, value, onChange, placeholder = 'Search...', className }, ref) => {
    const [localValue, setLocalValue] = useState(value);
    const debounced = useDebouncedValue(localValue);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    useEffect(() => {
      if (debounced !== value) onChange(debounced);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);

    return (
      <div className={cn('relative', className)}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={ref}
          id={id}
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full rounded-full border border-glass-border bg-glass pl-9 pr-3 text-sm text-slate-100 backdrop-blur-md placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-start/50 focus:shadow-glowSm"
        />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

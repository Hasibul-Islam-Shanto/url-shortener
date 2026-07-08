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
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          ref={ref}
          id={id}
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

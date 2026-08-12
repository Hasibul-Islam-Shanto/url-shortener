import { SearchInput } from '@/components/ui/SearchInput';
import { SORT_FIELDS, STATUS_FILTERS } from '@/utils/constants';
import type { UrlListParams, UrlStatus } from '../types';

const selectClassName =
  'h-10 rounded-full border border-white/10 bg-white/5 px-3 text-sm text-slate-200 backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:shadow-glowSm';

interface UrlFiltersProps {
  params: UrlListParams;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: UrlStatus | '') => void;
  onSortChange: (sort: string) => void;
}

export function UrlFilters({ params, onSearchChange, onStatusChange, onSortChange }: UrlFiltersProps) {
  const [sortField, sortDirection] = params.sort.split(':');

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <SearchInput
        id="urls-search-input"
        value={params.search ?? ''}
        onChange={onSearchChange}
        placeholder="Search by URL or short code..."
        className="sm:max-w-xs"
      />

      <div className="flex flex-wrap gap-2">
        <select
          value={params.status ?? ''}
          onChange={(e) => onStatusChange(e.target.value as UrlStatus | '')}
          className={selectClassName}
        >
          <option value="">All statuses</option>
          {STATUS_FILTERS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={sortField}
          onChange={(e) => onSortChange(`${e.target.value}:${sortDirection}`)}
          className={selectClassName}
        >
          {SORT_FIELDS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <select
          value={sortDirection}
          onChange={(e) => onSortChange(`${sortField}:${e.target.value}`)}
          className={selectClassName}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>
    </div>
  );
}

import { SearchInput } from '@/components/ui/SearchInput';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { RecentLinkRow } from './RecentLinkRow';
import type { Url } from '../types';
import type { Pagination as PaginationMeta } from '@/types/api';

interface RecentLinksListProps {
  urls: Url[];
  pagination: PaginationMeta;
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  search: string;
  onSearchChange: (search: string) => void;
  onPageChange: (page: number) => void;
  onRetry?: () => void;
}

export function RecentLinksList({
  urls,
  pagination,
  totalCount,
  isLoading,
  isError,
  errorMessage,
  search,
  onSearchChange,
  onPageChange,
  onRetry,
}: RecentLinksListProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-medium text-slate-100">Your links</h2>
          <p className="text-xs text-slate-400">
            {totalCount} {totalCount === 1 ? 'link' : 'links'}
          </p>
        </div>
        <SearchInput
          id="recent-links-search-input"
          value={search}
          onChange={onSearchChange}
          placeholder="Search links..."
          className="sm:max-w-xs"
        />
      </div>

      {isLoading && <LoadingSpinner fullPage />}

      {isError && <ErrorState message={errorMessage} onRetry={onRetry} />}

      {!isLoading && !isError && urls.length === 0 && (
        <EmptyState
          title="No links yet"
          description="Shorten your first URL above to see it here."
        />
      )}

      {!isLoading && !isError && urls.length > 0 && (
        <>
          <div className="glass-panel overflow-hidden">
            <div className="max-h-[28rem] overflow-y-auto">
              {urls.map((url) => (
                <RecentLinkRow key={url._id} url={url} />
              ))}
            </div>
          </div>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </section>
  );
}

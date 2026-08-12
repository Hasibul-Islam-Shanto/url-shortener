import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MoreVertical, Pencil, BarChart3, Ban, CheckCircle2, Trash2 } from 'lucide-react';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { CopyIconButton } from './CopyIconButton';
import { StatusDot } from './StatusDot';
import { useUpdateUrlMutation } from '../api/useUpdateUrlMutation';
import { useDeleteUrlMutation } from '../api/useDeleteUrlMutation';
import { buildShortUrl } from '../utils/buildShortUrl';
import type { Url } from '../types';
import type { NormalizedApiError } from '@/types/api';

export function RecentLinkRow({ url }: { url: Url }) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const navigate = useNavigate();
  const updateMutation = useUpdateUrlMutation(url._id);
  const deleteMutation = useDeleteUrlMutation();
  const shortUrl = buildShortUrl(url.shortCode);

  const handleToggleActive = () => {
    updateMutation.mutate(
      { isActive: !url.isActive },
      {
        onSuccess: () => toast.success(url.isActive ? 'URL disabled' : 'URL enabled'),
        onError: (error) => toast.error((error as NormalizedApiError).message),
      }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(url._id, {
      onSuccess: () => {
        toast.success('URL deleted');
        setConfirmDeleteOpen(false);
      },
      onError: (error) => toast.error((error as NormalizedApiError).message),
    });
  };

  return (
    <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3 transition-all duration-200 last:border-b-0 hover:bg-white/[0.08] hover:shadow-glowSm">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-100">{shortUrl.replace(/^https?:\/\//, '')}</p>
        <p className="truncate text-xs text-slate-500" title={url.originalUrl}>
          {url.originalUrl}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden text-xs text-slate-400 sm:inline">{url.clickCount} clicks</span>
        <StatusDot url={url} />
        <CopyIconButton shortCode={url.shortCode} />
        <Dropdown
          trigger={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Link actions"
              className="h-8 w-8 rounded-xl hover:bg-white/[0.08] hover:shadow-glowSm"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          }
        >
          <DropdownItem onSelect={() => navigate(`/urls/${url._id}/edit`)}>
            <Pencil className="h-4 w-4" /> Edit
          </DropdownItem>
          <DropdownItem onSelect={() => navigate(`/urls/${url._id}/analytics`)}>
            <BarChart3 className="h-4 w-4" /> View analytics
          </DropdownItem>
          <DropdownItem onSelect={handleToggleActive}>
            {url.isActive ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            {url.isActive ? 'Disable' : 'Enable'}
          </DropdownItem>
          <DropdownItem onSelect={() => setConfirmDeleteOpen(true)} destructive>
            <Trash2 className="h-4 w-4" /> Delete
          </DropdownItem>
        </Dropdown>
      </div>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Delete this URL?"
        description="This will permanently delete the short URL and its analytics. This cannot be undone."
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}

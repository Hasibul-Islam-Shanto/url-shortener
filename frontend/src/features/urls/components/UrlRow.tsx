import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MoreVertical, Pencil, BarChart3, Ban, CheckCircle2, Trash2 } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/Table';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { UrlStatusBadge } from './UrlStatusBadge';
import { CopyShortUrlButton } from './CopyShortUrlButton';
import { useUpdateUrlMutation } from '../api/useUpdateUrlMutation';
import { useDeleteUrlMutation } from '../api/useDeleteUrlMutation';
import { formatDate } from '@/utils/formatDate';
import type { Url } from '../types';
import type { NormalizedApiError } from '@/types/api';

export function UrlRow({ url }: { url: Url }) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const navigate = useNavigate();
  const updateMutation = useUpdateUrlMutation(url._id);
  const deleteMutation = useDeleteUrlMutation();

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
    <TableRow>
      <TableCell className="max-w-xs truncate">
        <Link to={`/urls/${url._id}`} className="hover:underline" title={url.originalUrl}>
          {url.originalUrl}
        </Link>
      </TableCell>
      <TableCell>
        <CopyShortUrlButton shortCode={url.shortCode} />
      </TableCell>
      <TableCell>{url.clickCount}</TableCell>
      <TableCell>
        <UrlStatusBadge url={url} />
      </TableCell>
      <TableCell>{formatDate(url.createdAt)}</TableCell>
      <TableCell>{formatDate(url.expiresAt)}</TableCell>
      <TableCell>
        <Dropdown
          trigger={
            <Button variant="ghost" size="icon" aria-label="Row actions">
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
      </TableCell>
    </TableRow>
  );
}

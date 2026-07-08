import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date: string | Date | null | undefined, pattern = 'MMM d, yyyy') {
  if (!date) return '—';
  return format(new Date(date), pattern);
}

export function formatDateTime(date: string | Date | null | undefined) {
  return formatDate(date, 'MMM d, yyyy h:mm a');
}

export function formatRelative(date: string | Date | null | undefined) {
  if (!date) return '—';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

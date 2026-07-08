export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
export const PUBLIC_BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL ?? '';

export const SORT_FIELDS = [
  { value: 'createdAt', label: 'Created date' },
  { value: 'clickCount', label: 'Click count' },
  { value: 'updatedAt', label: 'Updated date' },
  { value: 'originalUrl', label: 'Original URL' },
] as const;

export const STATUS_FILTERS = [
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' },
  { value: 'expired', label: 'Expired' },
] as const;

export const DEFAULT_PAGE_SIZE = 10;

export interface Url {
  _id: string;
  originalUrl: string;
  shortCode: string;
  user: string;
  clickCount: number;
  isActive: boolean;
  expiresAt: string | null;
  lastClickedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UrlStatus = 'active' | 'disabled' | 'expired';

export interface CreateUrlPayload {
  originalUrl: string;
  shortCode?: string;
  expiresAt?: string;
}

export interface UpdateUrlPayload {
  originalUrl?: string;
  isActive?: boolean;
  expiresAt?: string | null;
}

export type SortField = 'createdAt' | 'clickCount' | 'updatedAt' | 'originalUrl';
export type SortDirection = 'asc' | 'desc';

export interface UrlListParams {
  page: number;
  limit: number;
  sort: `${SortField}:${SortDirection}`;
  status?: UrlStatus;
  search?: string;
}

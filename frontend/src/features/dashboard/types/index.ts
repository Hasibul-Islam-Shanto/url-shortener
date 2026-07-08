import type { Url } from '@/features/urls/types';

export interface MostClickedUrl {
  _id: string;
  originalUrl: string;
  shortCode: string;
  clickCount: number;
}

export interface DashboardStats {
  totalUrls: number;
  totalClicks: number;
  activeUrls: number;
  expiredUrls: number;
  disabledUrls: number;
  mostClickedUrl: MostClickedUrl | null;
  recentUrls: Url[];
}

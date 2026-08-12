export interface AnalyticsVisit {
  _id: string;
  url: string;
  browser: string;
  operatingSystem: string;
  device: string;
  ipHash?: string;
  referrer: string;
  visitedAt: string;
}

export interface AnalyticsCount {
  _id: string | null;
  count: number;
}

export interface UrlAnalytics {
  summary: {
    total: number;
    byBrowser: AnalyticsCount[];
    byOS: AnalyticsCount[];
    byDevice: AnalyticsCount[];
  };
  recentVisits: AnalyticsVisit[];
}

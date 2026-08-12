const startedAt = Date.now();

const counters = {
  httpRequestsTotal: 0,
  httpErrorsTotal: 0,
  redirectsTotal: 0,
  analyticsEnqueuedTotal: 0,
  analyticsDroppedTotal: 0,
  analyticsFlushesTotal: 0,
  analyticsFlushFailuresTotal: 0,
};

export function incrementMetric(name: keyof typeof counters, amount = 1) {
  counters[name] += amount;
}

export function getMetricsSnapshot(extra: Record<string, unknown> = {}) {
  return {
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    ...counters,
    ...extra,
  };
}

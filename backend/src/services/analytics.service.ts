import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { Analytics, type AnalyticsAttrs } from '../models/analytics.model.js';
import { env } from '../config/env.js';
import { parseUserAgent } from '../lib/uaParser.js';
import { incrementMetric } from './metrics.service.js';
import { getUrlById } from './url.service.js';
import { logger } from '../utils/logger.js';

interface RequestMetadata {
  userAgent?: string;
  ip?: string;
  referrer?: string;
}

interface PaginationInput {
  page: number;
  limit: number;
}

type AnalyticsQueueItem = Omit<AnalyticsAttrs, 'url'> & { url: string };

const analyticsQueue: AnalyticsQueueItem[] = [];
let flushTimer: NodeJS.Timeout | null = null;
let isFlushing = false;

export function recordVisit(urlId: string, { userAgent, ip, referrer }: RequestMetadata) {
  const { browser, operatingSystem, device } = parseUserAgent(userAgent);

  if (analyticsQueue.length >= env.analyticsQueueMaxSize) {
    analyticsQueue.shift();
    incrementMetric('analyticsDroppedTotal');
    logger.warn('analytics_queue_drop', { reason: 'queue_full', queueSize: analyticsQueue.length });
  }

  analyticsQueue.push({
    url: urlId,
    browser,
    operatingSystem,
    device,
    ipHash: ip ? hashIp(ip) : undefined,
    referrer: referrer || 'Direct',
    visitedAt: new Date(),
  });

  incrementMetric('analyticsEnqueuedTotal');
}

function hashIp(ip: string) {
  return crypto.createHmac('sha256', env.analyticsIpSalt).update(ip).digest('hex');
}

export function startAnalyticsWorker() {
  if (flushTimer) return;

  flushTimer = setInterval(() => {
    void flushAnalyticsQueue();
  }, env.analyticsFlushIntervalMs);

  flushTimer.unref();
}

export async function stopAnalyticsWorker() {
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }

  await flushAnalyticsQueue();
}

export async function flushAnalyticsQueue() {
  if (isFlushing || analyticsQueue.length === 0) return;

  isFlushing = true;
  const batch = analyticsQueue.splice(0, env.analyticsBatchSize);

  try {
    await Analytics.insertMany(batch, { ordered: false });
    incrementMetric('analyticsFlushesTotal');
  } catch (err) {
    analyticsQueue.unshift(...batch);
    incrementMetric('analyticsFlushFailuresTotal');
    logger.error('analytics_flush_failed', { error: err instanceof Error ? err.message : String(err) });
  } finally {
    isFlushing = false;
  }

  if (analyticsQueue.length > 0) {
    await flushAnalyticsQueue();
  }
}

export function getAnalyticsQueueStats() {
  return {
    size: analyticsQueue.length,
    maxSize: env.analyticsQueueMaxSize,
    batchSize: env.analyticsBatchSize,
    flushIntervalMs: env.analyticsFlushIntervalMs,
    isFlushing,
  };
}

export async function getUrlAnalytics(userId: string, urlId: string, { page, limit }: PaginationInput) {
  await getUrlById(userId, urlId);

  const [facetResult, recentVisits, total] = await Promise.all([
    Analytics.aggregate([
      { $match: { url: new mongoose.Types.ObjectId(urlId) } },
      {
        $facet: {
          byBrowser: [{ $group: { _id: '$browser', count: { $sum: 1 } } }],
          byOS: [{ $group: { _id: '$operatingSystem', count: { $sum: 1 } } }],
          byDevice: [{ $group: { _id: '$device', count: { $sum: 1 } } }],
        },
      },
    ]),
    Analytics.find({ url: urlId })
      .sort({ visitedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Analytics.countDocuments({ url: urlId }),
  ]);

  const facet = facetResult[0] || { byBrowser: [], byOS: [], byDevice: [] };

  return {
    summary: {
      total,
      byBrowser: facet.byBrowser,
      byOS: facet.byOS,
      byDevice: facet.byDevice,
    },
    recentVisits,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 0,
    },
  };
}

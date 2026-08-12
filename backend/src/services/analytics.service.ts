import mongoose from 'mongoose';
import { Analytics } from '../models/analytics.model.js';
import { parseUserAgent } from '../lib/uaParser.js';
import { getUrlById } from './url.service.js';

interface RequestMetadata {
  userAgent?: string;
  ip?: string;
  referrer?: string;
}

interface PaginationInput {
  page: number;
  limit: number;
}

export async function recordVisit(urlId: string, { userAgent, ip, referrer }: RequestMetadata) {
  const { browser, operatingSystem, device } = parseUserAgent(userAgent);

  await Analytics.create({
    url: urlId,
    browser,
    operatingSystem,
    device,
    ipAddress: ip,
    referrer: referrer || 'Direct',
  });
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

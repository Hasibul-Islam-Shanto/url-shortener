import mongoose from 'mongoose';
import { Url } from '../models/url.model.js';

const EMPTY_COUNTS = {
  totalUrls: 0,
  totalClicks: 0,
  activeUrls: 0,
  expiredUrls: 0,
  disabledUrls: 0,
};

export async function getDashboardStats(userId) {
  const [result] = await Url.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $facet: {
        counts: [
          {
            $group: {
              _id: null,
              totalUrls: { $sum: 1 },
              totalClicks: { $sum: '$clickCount' },
              activeUrls: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        '$isActive',
                        { $or: [{ $eq: ['$expiresAt', null] }, { $gt: ['$expiresAt', '$$NOW'] }] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
              expiredUrls: {
                $sum: {
                  $cond: [
                    {
                      $and: ['$isActive', { $ne: ['$expiresAt', null] }, { $lte: ['$expiresAt', '$$NOW'] }],
                    },
                    1,
                    0,
                  ],
                },
              },
              disabledUrls: { $sum: { $cond: ['$isActive', 0, 1] } },
            },
          },
        ],
        mostClickedUrl: [
          { $sort: { clickCount: -1 } },
          { $limit: 1 },
          { $project: { originalUrl: 1, shortCode: 1, clickCount: 1 } },
        ],
        recentUrls: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          { $project: { originalUrl: 1, shortCode: 1, isActive: 1, clickCount: 1, createdAt: 1 } },
        ],
      },
    },
  ]);

  const counts = result.counts[0] || EMPTY_COUNTS;

  return {
    totalUrls: counts.totalUrls,
    totalClicks: counts.totalClicks,
    activeUrls: counts.activeUrls,
    expiredUrls: counts.expiredUrls,
    disabledUrls: counts.disabledUrls,
    mostClickedUrl: result.mostClickedUrl[0] || null,
    recentUrls: result.recentUrls,
  };
}

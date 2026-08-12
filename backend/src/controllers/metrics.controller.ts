import { getAnalyticsQueueStats } from '../services/analytics.service.js';
import { getMetricsSnapshot } from '../services/metrics.service.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getMetrics = asyncHandler(async (req, res) => {
  if (env.metricsToken) {
    const bearerToken = req.get('authorization')?.replace(/^Bearer\s+/i, '');
    const headerToken = req.get('x-metrics-token');

    if (bearerToken !== env.metricsToken && headerToken !== env.metricsToken) {
      throw new ApiError(401, 'Not authenticated');
    }
  }

  res.status(200).json(new ApiResponse(getMetricsSnapshot({ analyticsQueue: getAnalyticsQueueStats() })));
});

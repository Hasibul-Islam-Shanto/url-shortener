import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getUrlAnalytics } from '../services/analytics.service.js';

export const getAnalyticsForUrl = asyncHandler(async (req, res) => {
  const result = await getUrlAnalytics(req.user!._id.toString(), String(req.params.id), req.query as never);
  res.status(200).json(new ApiResponse(result));
});

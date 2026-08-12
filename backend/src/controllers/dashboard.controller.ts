import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getDashboardStats } from '../services/dashboard.service.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats(req.user!._id.toString());
  res.status(200).json(new ApiResponse(stats));
});

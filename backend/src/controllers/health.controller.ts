import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const liveness = asyncHandler(async (_req, res) => {
  res.status(200).json(new ApiResponse({ status: 'ok' }));
});

export const readiness = asyncHandler(async (_req, res) => {
  const isDatabaseReady = mongoose.connection.readyState === 1;

  res.status(isDatabaseReady ? 200 : 503).json(
    new ApiResponse({
      status: isDatabaseReady ? 'ready' : 'not_ready',
      database: isDatabaseReady ? 'connected' : 'disconnected',
    })
  );
});

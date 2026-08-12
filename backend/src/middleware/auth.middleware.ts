import { verifyToken } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';
import { AuthSession } from '../models/session.model.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { RequestHandler } from 'express';

export const protect: RequestHandler = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[env.cookieName];

  if (!token) {
    throw new ApiError(401, 'Not authenticated');
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new ApiError(401, 'Invalid or expired session');
  }

  if (!payload.sessionId) {
    throw new ApiError(401, 'Invalid or expired session');
  }

  const session = await AuthSession.findOne({
    tokenId: payload.sessionId,
    user: payload.id,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    throw new ApiError(401, 'Invalid or expired session');
  }

  const user = await User.findById(payload.id);
  if (!user) {
    throw new ApiError(401, 'User no longer exists');
  }

  req.user = user;
  next();
});

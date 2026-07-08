import { Url } from '../models/url.model.js';
import { ApiError } from '../utils/ApiError.js';
import { recordVisit } from './analytics.service.js';

export async function resolveAndRegisterClick(shortCode, { userAgent, ip, referrer }) {
  const url = await Url.findOne({ shortCode });

  if (!url) {
    throw new ApiError(404, 'Short URL not found');
  }

  if (!url.isActive) {
    throw new ApiError(410, 'This link has been disabled');
  }

  if (url.expiresAt && url.expiresAt.getTime() < Date.now()) {
    throw new ApiError(410, 'This link has expired');
  }

  const updated = await Url.findOneAndUpdate(
    { _id: url._id },
    { $inc: { clickCount: 1 }, $set: { lastClickedAt: new Date() } },
    { new: true }
  );

  try {
    await recordVisit(updated._id, { userAgent, ip, referrer });
  } catch (err) {
    console.error('Failed to record analytics visit:', err);
  }

  return { originalUrl: updated.originalUrl };
}

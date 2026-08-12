import { Url } from '../models/url.model.js';
import { ApiError } from '../utils/ApiError.js';
import { recordVisit } from './analytics.service.js';

interface RequestMetadata {
  userAgent?: string;
  ip?: string;
  referrer?: string;
}

export async function resolveAndRegisterClick(shortCode: string, { userAgent, ip, referrer }: RequestMetadata) {
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

  if (!updated) {
    throw new ApiError(404, 'Short URL not found');
  }

  try {
    await recordVisit(updated._id.toString(), { userAgent, ip, referrer });
  } catch (err) {
    console.error('Failed to record analytics visit:', err);
  }

  return { originalUrl: updated.originalUrl };
}

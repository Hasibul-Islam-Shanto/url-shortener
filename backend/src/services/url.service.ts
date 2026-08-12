import { Url } from '../models/url.model.js';
import { Analytics } from '../models/analytics.model.js';
import { ApiError } from '../utils/ApiError.js';
import { generateShortCode } from '../utils/shortCode.js';
import { escapeRegex } from '../utils/escapeRegex.js';
import type { FilterQuery } from 'mongoose';
import type { UrlAttrs } from '../models/url.model.js';

const MAX_GENERATION_ATTEMPTS = 5;

interface CreateShortUrlInput {
  originalUrl: string;
  shortCode?: string;
  expiresAt?: Date;
}

interface ListUrlsInput {
  page: number;
  limit: number;
  sort: string;
  status?: 'active' | 'disabled' | 'expired';
  search?: string;
}

interface UpdateUrlInput {
  originalUrl?: string;
  isActive?: boolean;
  expiresAt?: Date | null;
}

export async function createShortUrl(userId: string, { originalUrl, shortCode, expiresAt }: CreateShortUrlInput) {
  if (shortCode) {
    const existing = await Url.findOne({ shortCode });
    if (existing) {
      throw new ApiError(409, 'This short code is already taken');
    }

    try {
      return await Url.create({
        originalUrl,
        shortCode,
        user: userId,
        expiresAt: expiresAt ?? null,
      });
    } catch (err) {
      if (isDuplicateShortCodeError(err)) {
        throw new ApiError(409, 'This short code is already taken');
      }
      throw err;
    }
  }

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await Url.create({
        originalUrl,
        shortCode: generateShortCode(),
        user: userId,
        expiresAt: expiresAt ?? null,
      });
    } catch (err) {
      if (!isDuplicateShortCodeError(err)) throw err;
    }
  }

  throw new ApiError(500, 'Failed to generate a unique short code, please try again');
}

export async function listUrls(userId: string, { page, limit, sort, status, search }: ListUrlsInput) {
  const now = new Date();
  const filter: FilterQuery<UrlAttrs> = { user: userId };
  const andConditions: FilterQuery<UrlAttrs>[] = [];

  if (status === 'disabled') {
    filter.isActive = false;
  } else if (status === 'active') {
    filter.isActive = true;
    andConditions.push({ $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] });
  } else if (status === 'expired') {
    filter.isActive = true;
    filter.expiresAt = { $ne: null, $lte: now };
  }

  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    andConditions.push({ $or: [{ originalUrl: rx }, { shortCode: rx }] });
  }

  if (andConditions.length > 0) {
    filter.$and = andConditions;
  }

  const [sortField, sortDir] = sort.split(':');
  const sortObj: Record<string, 1 | -1> = { [sortField]: sortDir === 'asc' ? 1 : -1 };

  const [urls, total] = await Promise.all([
    Url.find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit),
    Url.countDocuments(filter),
  ]);

  return {
    urls,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 0,
    },
  };
}

export async function getUrlById(userId: string, urlId: string) {
  const url = await Url.findOne({ _id: urlId, user: userId });
  if (!url) {
    throw new ApiError(404, 'URL not found');
  }
  return url;
}

export async function updateUrl(userId: string, urlId: string, { originalUrl, isActive, expiresAt }: UpdateUrlInput) {
  const url = await getUrlById(userId, urlId);

  if (originalUrl !== undefined) url.originalUrl = originalUrl;
  if (isActive !== undefined) url.isActive = isActive;
  if (expiresAt !== undefined) url.expiresAt = expiresAt;

  await url.save();
  return url;
}

export async function deleteUrl(userId: string, urlId: string) {
  const url = await getUrlById(userId, urlId);
  await Analytics.deleteMany({ url: url._id });
  await url.deleteOne();
}

function isDuplicateShortCodeError(err: unknown) {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code?: number }).code === 11000 &&
    'keyPattern' in err &&
    Boolean((err as { keyPattern?: { shortCode?: number } }).keyPattern?.shortCode)
  );
}

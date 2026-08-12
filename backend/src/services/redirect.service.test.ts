import test from 'node:test';
import assert from 'node:assert/strict';
import { Url } from '../models/url.model.js';
import { Analytics } from '../models/analytics.model.js';
import { resolveAndRegisterClick } from './redirect.service.js';

const originalFindOne = Url.findOne;
const originalFindOneAndUpdate = Url.findOneAndUpdate;
const originalAnalyticsCreate = Analytics.create;

test.afterEach(() => {
  Url.findOne = originalFindOne;
  Url.findOneAndUpdate = originalFindOneAndUpdate;
  Analytics.create = originalAnalyticsCreate;
});

test('resolveAndRegisterClick rejects missing, disabled, and expired links', async () => {
  Url.findOne = (async () => null) as never;
  await assert.rejects(() => resolveAndRegisterClick('missing', {}), {
    statusCode: 404,
    message: 'Short URL not found',
  });

  Url.findOne = (async () => ({ isActive: false })) as never;
  await assert.rejects(() => resolveAndRegisterClick('disabled', {}), {
    statusCode: 410,
    message: 'This link has been disabled',
  });

  Url.findOne = (async () => ({
    isActive: true,
    expiresAt: new Date(Date.now() - 1000),
  })) as never;
  await assert.rejects(() => resolveAndRegisterClick('expired', {}), {
    statusCode: 410,
    message: 'This link has expired',
  });
});

test('resolveAndRegisterClick increments clicks and records analytics for valid links', async () => {
  let updateFilter: unknown;
  let updateOperation: { $inc: { clickCount: number }; $set: { lastClickedAt: Date } } | undefined;
  let analyticsPayload: { url: string; ipAddress?: string; referrer: string } | undefined;

  Url.findOne = (async (filter: { shortCode: string }) => ({
    _id: 'url-id',
    shortCode: filter.shortCode,
    originalUrl: 'https://example.com',
    isActive: true,
    expiresAt: null,
  })) as never;
  Url.findOneAndUpdate = (async (filter: unknown, operation: { $inc: { clickCount: number }; $set: { lastClickedAt: Date } }) => {
    updateFilter = filter;
    updateOperation = operation;
    return { _id: 'url-id', originalUrl: 'https://example.com' };
  }) as never;
  Analytics.create = (async (payload: { url: string; ipAddress?: string; referrer: string }) => {
    analyticsPayload = payload;
    return payload;
  }) as never;

  const result = await resolveAndRegisterClick('abc123', {
    userAgent: 'Mozilla/5.0',
    ip: '127.0.0.1',
    referrer: 'https://referrer.example',
  });

  assert.deepEqual(result, { originalUrl: 'https://example.com' });
  assert.deepEqual(updateFilter, { _id: 'url-id' });
  assert.equal(updateOperation?.$inc.clickCount, 1);
  assert.ok(updateOperation?.$set.lastClickedAt instanceof Date);
  assert.equal(analyticsPayload?.url, 'url-id');
  assert.equal(analyticsPayload?.ipAddress, '127.0.0.1');
  assert.equal(analyticsPayload?.referrer, 'https://referrer.example');
});

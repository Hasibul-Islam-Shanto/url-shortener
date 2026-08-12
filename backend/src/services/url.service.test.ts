import test from 'node:test';
import assert from 'node:assert/strict';
import { Url } from '../models/url.model.js';
import { getUrlById } from './url.service.js';

const originalFindOne = Url.findOne;

test.afterEach(() => {
  Url.findOne = originalFindOne;
});

test('getUrlById scopes lookups to the authenticated user', async () => {
  let filter: unknown;
  const expectedUrl = { _id: 'url-id', user: 'user-id' };
  Url.findOne = (async (value: unknown) => {
    filter = value;
    return expectedUrl;
  }) as never;

  const url = await getUrlById('user-id', 'url-id');

  assert.deepEqual(filter, { _id: 'url-id', user: 'user-id' });
  assert.equal(url, expectedUrl);
});

test('getUrlById returns not found when URL is missing or owned by someone else', async () => {
  Url.findOne = (async () => null) as never;

  await assert.rejects(() => getUrlById('user-id', 'url-id'), {
    statusCode: 404,
    message: 'URL not found',
  });
});

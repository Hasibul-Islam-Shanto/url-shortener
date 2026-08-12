import test from 'node:test';
import assert from 'node:assert/strict';
import { createUrlSchema, updateUrlSchema } from './url.validator.js';

const unsafeUrls = [
  'javascript:alert(1)',
  'data:text/html,<script>alert(1)</script>',
  'ftp://example.com/file.txt',
];

test('create URL validation only accepts http and https targets', () => {
  assert.equal(createUrlSchema.safeParse({ originalUrl: 'https://example.com' }).success, true);
  assert.equal(createUrlSchema.safeParse({ originalUrl: 'http://example.com' }).success, true);

  for (const originalUrl of unsafeUrls) {
    assert.equal(createUrlSchema.safeParse({ originalUrl }).success, false);
  }
});

test('update URL validation only accepts http and https targets', () => {
  assert.equal(updateUrlSchema.safeParse({ originalUrl: 'https://example.com' }).success, true);
  assert.equal(updateUrlSchema.safeParse({ isActive: false }).success, true);

  for (const originalUrl of unsafeUrls) {
    assert.equal(updateUrlSchema.safeParse({ originalUrl }).success, false);
  }
});

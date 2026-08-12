import test from 'node:test';
import assert from 'node:assert/strict';
import { csrfProtection } from './csrf.middleware.js';
import { env } from '../config/env.js';
import type { Request, Response } from 'express';
import type { ApiError } from '../utils/ApiError.js';

function runCsrf(req: Partial<Request>) {
  return new Promise<ApiError | null>((resolve) => {
    csrfProtection(req as Request, {} as Response, (err) => resolve((err as ApiError | undefined) ?? null));
  });
}

test('csrfProtection allows safe methods and login/register', async () => {
  assert.equal(await runCsrf({ method: 'GET', path: '/api/urls' }), null);
  assert.equal(await runCsrf({ method: 'POST', path: '/api/auth/login' }), null);
  assert.equal(await runCsrf({ method: 'POST', path: '/api/auth/register' }), null);
  assert.equal(await runCsrf({ method: 'POST', baseUrl: '/api', path: '/auth/login' }), null);
});

test('csrfProtection rejects unsafe requests without matching csrf tokens', async () => {
  const missing = await runCsrf({ method: 'POST', path: '/api/urls', cookies: {}, get: () => undefined } as Partial<Request>);
  assert.ok(missing);
  assert.equal(missing.statusCode, 403);

  const mismatched = await runCsrf({
    method: 'DELETE',
    path: '/api/urls/id',
    cookies: { [env.csrfCookieName]: 'cookie-token' },
    get: () => 'header-token',
  } as unknown as Partial<Request>);
  assert.ok(mismatched);
  assert.equal(mismatched.statusCode, 403);
});

test('csrfProtection allows unsafe requests with matching csrf tokens', async () => {
  const err = await runCsrf({
    method: 'PATCH',
    path: '/api/auth/profile',
    cookies: { [env.csrfCookieName]: 'csrf-token' },
    get: () => 'csrf-token',
  } as unknown as Partial<Request>);

  assert.equal(err, null);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { User } from '../models/user.model.js';
import { AuthSession } from '../models/session.model.js';
import { protect } from './auth.middleware.js';
import { signToken } from '../utils/jwt.js';
import { env } from '../config/env.js';
import type { Request, Response } from 'express';
import type { ApiError } from '../utils/ApiError.js';

const originalFindById = User.findById;
const originalSessionFindOne = AuthSession.findOne;

test.afterEach(() => {
  User.findById = originalFindById;
  AuthSession.findOne = originalSessionFindOne;
});

function runProtect(req: Partial<Request>) {
  return new Promise<ApiError | null>((resolve) => {
    protect(req as Request, {} as Response, (err) => resolve((err as ApiError | undefined) ?? null));
  });
}

test('protect rejects requests without a session cookie', async () => {
  const err = await runProtect({ cookies: {} });

  assert.ok(err);
  assert.equal(err.statusCode, 401);
  assert.equal(err.message, 'Not authenticated');
});

test('protect rejects invalid session cookies', async () => {
  const err = await runProtect({ cookies: { [env.cookieName]: 'not-a-token' } });

  assert.ok(err);
  assert.equal(err.statusCode, 401);
  assert.equal(err.message, 'Invalid or expired session');
});

test('protect rejects tokens for deleted users', async () => {
  AuthSession.findOne = (async () => ({ tokenId: 'session-id' })) as never;
  User.findById = (async () => null) as never;

  const token = signToken({ id: 'user-id', sessionId: 'session-id' });
  const err = await runProtect({ cookies: { [env.cookieName]: token } });

  assert.ok(err);
  assert.equal(err.statusCode, 401);
  assert.equal(err.message, 'User no longer exists');
});

test('protect rejects revoked or expired sessions', async () => {
  AuthSession.findOne = (async () => null) as never;

  const token = signToken({ id: 'user-id', sessionId: 'session-id' });
  const err = await runProtect({ cookies: { [env.cookieName]: token } });

  assert.ok(err);
  assert.equal(err.statusCode, 401);
  assert.equal(err.message, 'Invalid or expired session');
});

test('protect attaches the authenticated user and calls next', async () => {
  const user = { _id: 'user-id', email: 'test@example.com' };
  AuthSession.findOne = (async () => ({ tokenId: 'session-id' })) as never;
  User.findById = (async () => user) as never;

  const req = { cookies: { [env.cookieName]: signToken({ id: user._id, sessionId: 'session-id' }) } } as Partial<Request>;
  const err = await runProtect(req);

  assert.equal(err, null);
  assert.equal((req as Request).user, user);
});

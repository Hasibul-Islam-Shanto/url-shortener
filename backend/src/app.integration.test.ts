import { EventEmitter } from 'node:events';
import test from 'node:test';
import assert from 'node:assert/strict';
import { User } from './models/user.model.js';
import { AuthSession } from './models/session.model.js';
import { Url } from './models/url.model.js';
import { env } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import { csrfProtection } from './middleware/csrf.middleware.js';
import { protect } from './middleware/auth.middleware.js';
import { validate } from './middleware/validate.middleware.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { createUrlSchema } from './validators/url.validator.js';
import { liveness, readiness } from './controllers/health.controller.js';
import * as authController from './controllers/auth.controller.js';
import * as urlController from './controllers/url.controller.js';
import type { Request, Response, RequestHandler } from 'express';

const originalUserFindOne = User.findOne;
const originalUserFindById = User.findById;
const originalUserCreate = User.create;
const originalSessionCreate = AuthSession.create;
const originalSessionFindOne = AuthSession.findOne;
const originalUrlFindOne = Url.findOne;
const originalUrlCreate = Url.create;

test.afterEach(() => {
  User.findOne = originalUserFindOne;
  User.findById = originalUserFindById;
  User.create = originalUserCreate;
  AuthSession.create = originalSessionCreate;
  AuthSession.findOne = originalSessionFindOne;
  Url.findOne = originalUrlFindOne;
  Url.create = originalUrlCreate;
});

test('health controllers and request logger attach request ids', async () => {
  const health = await runHandlers(createReq('GET', '/healthz', { headers: { 'x-request-id': 'test-request-id' } }), [
    requestLogger,
    liveness,
  ]);
  const ready = await runHandlers(createReq('GET', '/readyz'), [requestLogger, readiness]);

  assert.equal(health.statusCode, 200);
  assert.deepEqual(health.headers['x-request-id'], ['test-request-id']);
  assert.equal(ready.statusCode, 503);
});

test('register sets auth/csrf cookies and csrf is required for protected writes', async () => {
  const user = {
    _id: { toString: () => 'user-id' },
    name: 'Ada Lovelace',
    email: 'ada@example.com',
  };
  const createdUrl = {
    _id: 'url-id',
    originalUrl: 'https://example.com/docs',
    shortCode: 'docs',
    user: 'user-id',
    clickCount: 0,
    isActive: true,
  };

  User.findOne = (async () => null) as never;
  User.findById = (async () => user) as never;
  User.create = (async () => user) as never;
  AuthSession.create = (async (session: unknown) => session) as never;
  AuthSession.findOne = (async () => ({ tokenId: 'session-id' })) as never;
  Url.findOne = (async () => null) as never;
  Url.create = (async () => createdUrl) as never;

  const register = await runHandlers(
    createReq('POST', '/api/auth/register', {
      path: '/auth/register',
      baseUrl: '/api',
      body: {
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        password: 'correct-horse-battery-staple',
      },
    }),
    [csrfProtection, validateRequest(authController.register)],
  );

  assert.equal(register.statusCode, 201);

  const cookie = (register.headers['set-cookie'] ?? [])
    .map((value) => value.split(';')[0])
    .join('; ');
  const csrfToken = readCookie(cookie, env.csrfCookieName);

  assert.ok(readCookie(cookie, env.cookieName));
  assert.ok(csrfToken);

  const missingCsrf = await runHandlers(
    createReq('POST', '/api/urls', {
      path: '/urls',
      baseUrl: '/api',
      headers: { cookie },
      cookies: parseCookies(cookie),
      body: { originalUrl: 'https://example.com/docs', shortCode: 'docs' },
    }),
    [csrfProtection, protect, validate(createUrlSchema), validateRequest(urlController.createUrl)],
  );

  assert.equal(missingCsrf.statusCode, 403);

  const createUrl = await runHandlers(
    createReq('POST', '/api/urls', {
      path: '/urls',
      baseUrl: '/api',
      headers: { cookie, 'x-csrf-token': csrfToken },
      cookies: parseCookies(cookie),
      body: { originalUrl: 'https://example.com/docs', shortCode: 'docs' },
    }),
    [csrfProtection, protect, validate(createUrlSchema), validateRequest(urlController.createUrl)],
  );
  const body = createUrl.body as { data: { url: { shortCode: string } } };

  assert.equal(createUrl.statusCode, 201);
  assert.equal(body.data.url.shortCode, 'docs');
});

function validateRequest(handler: RequestHandler) {
  return handler;
}

function createReq(method: string, originalUrl: string, options: {
  baseUrl?: string;
  path?: string;
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
  body?: unknown;
} = {}) {
  const headers = lowerCaseHeaders(options.headers ?? {});

  return {
    method,
    originalUrl,
    url: options.path ?? originalUrl,
    baseUrl: options.baseUrl ?? '',
    path: options.path ?? originalUrl,
    headers,
    cookies: options.cookies ?? {},
    body: options.body,
    query: {},
    params: {},
    ip: '127.0.0.1',
    get: (name: string) => headers[name.toLowerCase()],
    header: (name: string) => headers[name.toLowerCase()],
  } as unknown as Request;
}

async function runHandlers(req: Request, handlers: RequestHandler[]) {
  const res = createRes();
  let index = 0;

  async function next(err?: unknown): Promise<void> {
    if (err) {
      await new Promise<void>((resolve) => errorHandler(err, req, res as unknown as Response, () => resolve()));
      res.emit('finish');
      return;
    }

    const handler = handlers[index];
    index += 1;

    if (!handler) {
      res.emit('finish');
      return;
    }

    await new Promise<void>((resolve) => {
      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        res.off('finish', settle);
        resolve();
      };

      res.once('finish', settle);

      const maybePromise = handler(req, res as unknown as Response, (nextErr?: unknown) => {
        void next(nextErr).then(settle);
      });

      if (maybePromise && typeof (maybePromise as Promise<void>).then === 'function') {
        void (maybePromise as Promise<void>).then(() => {
          if (res.finished) settle();
        });
      } else if (res.finished) {
        settle();
      }
    });
  }

  await next();

  if (!res.finished) {
    res.emit('finish');
  }

  return res;
}

function createRes() {
  const res = new EventEmitter() as EventEmitter & {
    statusCode: number;
    headers: Record<string, string[]>;
    body: unknown;
    finished: boolean;
    locals: Record<string, unknown>;
    status: (code: number) => typeof res;
    json: (body: unknown) => typeof res;
    setHeader: (name: string, value: string | string[]) => typeof res;
    getHeader: (name: string) => string[] | undefined;
    cookie: (name: string, value: string, options?: Record<string, unknown>) => typeof res;
    clearCookie: (name: string) => typeof res;
  };

  res.statusCode = 200;
  res.headers = {};
  res.body = null;
  res.finished = false;
  res.locals = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.body = body;
    res.finished = true;
    res.emit('finish');
    return res;
  };
  res.setHeader = (name, value) => {
    res.headers[name.toLowerCase()] = Array.isArray(value) ? value : [value];
    return res;
  };
  res.getHeader = (name) => res.headers[name.toLowerCase()];
  res.cookie = (name, value, options = {}) => {
    const cookie = `${name}=${encodeURIComponent(value)}${formatCookieOptions(options)}`;
    res.headers['set-cookie'] = [...(res.headers['set-cookie'] ?? []), cookie];
    return res;
  };
  res.clearCookie = (name) => {
    res.headers['set-cookie'] = [...(res.headers['set-cookie'] ?? []), `${name}=; Max-Age=0`];
    return res;
  };

  return res;
}

function readCookie(cookieHeader: string, name: string) {
  return cookieHeader
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function parseCookies(cookieHeader: string) {
  return Object.fromEntries(
    cookieHeader.split('; ').map((cookie) => {
      const [name, ...value] = cookie.split('=');
      return [name, decodeURIComponent(value.join('='))];
    }),
  );
}

function lowerCaseHeaders(headers: Record<string, string>) {
  return Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]));
}

function formatCookieOptions(options: Record<string, unknown>) {
  const parts: string[] = [];
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.secure) parts.push('Secure');
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (typeof options.maxAge === 'number') parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
  return parts.length > 0 ? `; ${parts.join('; ')}` : '';
}

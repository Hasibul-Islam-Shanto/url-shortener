import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';
import type { RequestHandler } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const CSRF_EXEMPT_PATHS = new Set(['/api/auth/login', '/api/auth/register']);

export const csrfProtection: RequestHandler = (req, _res, next) => {
  const fullPath = `${req.baseUrl}${req.path}`;

  if (SAFE_METHODS.has(req.method) || CSRF_EXEMPT_PATHS.has(req.path) || CSRF_EXEMPT_PATHS.has(fullPath)) {
    return next();
  }

  const cookieToken = req.cookies?.[env.csrfCookieName];
  const headerToken = req.get('x-csrf-token');

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return next(new ApiError(403, 'Invalid CSRF token'));
  }

  next();
};

import { env } from '../config/env.js';
import { parseDurationToMs } from './duration.js';
import type { CookieOptions } from 'express';

export function getCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    maxAge: parseDurationToMs(env.jwtExpiresIn),
  };
}

export function getCsrfCookieOptions(): CookieOptions {
  return {
    httpOnly: false,
    secure: env.isProduction,
    sameSite: 'lax',
    maxAge: parseDurationToMs(env.jwtExpiresIn),
  };
}

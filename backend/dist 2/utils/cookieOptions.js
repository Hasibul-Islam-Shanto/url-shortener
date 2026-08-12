import { env } from '../config/env.js';
import { parseDurationToMs } from './duration.js';
export function getCookieOptions() {
    return {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: 'lax',
        maxAge: parseDurationToMs(env.jwtExpiresIn),
    };
}
export function getCsrfCookieOptions() {
    return {
        httpOnly: false,
        secure: env.isProduction,
        sameSite: 'lax',
        maxAge: parseDurationToMs(env.jwtExpiresIn),
    };
}

import crypto from 'node:crypto';
import type { Response } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getCookieOptions, getCsrfCookieOptions } from '../utils/cookieOptions.js';
import { env } from '../config/env.js';
import * as authService from '../services/auth.service.js';

function setAuthCookies(res: Response, token: string) {
  res.cookie(env.cookieName, token, getCookieOptions());
  res.cookie(env.csrfCookieName, crypto.randomUUID(), getCsrfCookieOptions());
}

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);
  setAuthCookies(res, token);
  res.status(201).json(new ApiResponse({ user }, 'Registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);
  setAuthCookies(res, token);
  res.status(200).json(new ApiResponse({ user }, 'Logged in successfully'));
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.[env.cookieName];

  if (token) {
    try {
      const payload = verifyToken(token);
      if (payload.sessionId) {
        await authService.revokeSession(payload.sessionId);
      }
    } catch {
      // Invalid tokens are still cleared client-side.
    }
  }

  res.clearCookie(env.cookieName, getCookieOptions());
  res.clearCookie(env.csrfCookieName, getCsrfCookieOptions());
  res.status(200).json(new ApiResponse(null, 'Logged out successfully'));
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user!._id.toString());
  res.status(200).json(new ApiResponse({ user }));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user!._id.toString(), req.body);
  res.status(200).json(new ApiResponse({ user }, 'Profile updated successfully'));
});

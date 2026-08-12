import jwt from 'jsonwebtoken';
import type { JwtPayload, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AppJwtPayload extends JwtPayload {
  id: string;
}

export function signToken(payload: AppJwtPayload) {
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as AppJwtPayload;
}

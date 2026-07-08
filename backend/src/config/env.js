import dotenv from 'dotenv';

dotenv.config();

const required = ['MONGODB_URI', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',

  mongodbUri: process.env.MONGODB_URI,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieName: process.env.COOKIE_NAME || 'token',

  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  baseUrl: process.env.BASE_URL || 'http://localhost:5000',

  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100,
  authRateLimitMax: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,

  shortCodeLength: Number(process.env.SHORT_CODE_LENGTH) || 7,
  trustProxy: process.env.TRUST_PROXY === 'true',
};

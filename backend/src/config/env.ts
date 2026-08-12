import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const optionalString = z.preprocess((value) => (value === '' ? undefined : value), z.string().optional());

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  ANALYTICS_IP_SALT: optionalString.pipe(z.string().min(32).optional()),
  JWT_EXPIRES_IN: z.string().regex(/^\d+[smhd]$/, 'JWT_EXPIRES_IN must look like 15m, 12h, or 7d').default('7d'),
  COOKIE_NAME: z.string().min(1).default('token'),
  CSRF_COOKIE_NAME: z.string().min(1).default('csrfToken'),

  CLIENT_URL: z.string().url().default('http://localhost:3000'),
  BASE_URL: z.string().url().default('http://localhost:5000'),
  BLOCKED_REDIRECT_HOSTS: z.string().default(''),
  ALLOWED_REDIRECT_HOSTS: z.string().default(''),
  METRICS_TOKEN: optionalString,

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),

  ANALYTICS_RETENTION_DAYS: z.coerce.number().int().nonnegative().default(90),
  ANALYTICS_QUEUE_MAX_SIZE: z.coerce.number().int().positive().default(5000),
  ANALYTICS_FLUSH_INTERVAL_MS: z.coerce.number().int().positive().default(5000),
  ANALYTICS_BATCH_SIZE: z.coerce.number().int().positive().default(100),

  SHORT_CODE_LENGTH: z.coerce.number().int().min(3).max(30).default(7),
  TRUST_PROXY: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
  throw new Error(`Invalid environment configuration: ${details}`);
}

export const env = {
  port: parsed.data.PORT,
  nodeEnv: parsed.data.NODE_ENV,
  isProduction: parsed.data.NODE_ENV === 'production',

  mongodbUri: parsed.data.MONGODB_URI,

  jwtSecret: parsed.data.JWT_SECRET,
  analyticsIpSalt: parsed.data.ANALYTICS_IP_SALT ?? parsed.data.JWT_SECRET,
  jwtExpiresIn: parsed.data.JWT_EXPIRES_IN,
  cookieName: parsed.data.COOKIE_NAME,
  csrfCookieName: parsed.data.CSRF_COOKIE_NAME,

  clientUrl: parsed.data.CLIENT_URL,
  baseUrl: parsed.data.BASE_URL,
  blockedRedirectHosts: parseCsv(parsed.data.BLOCKED_REDIRECT_HOSTS),
  allowedRedirectHosts: parseCsv(parsed.data.ALLOWED_REDIRECT_HOSTS),
  metricsToken: parsed.data.METRICS_TOKEN,

  rateLimitWindowMs: parsed.data.RATE_LIMIT_WINDOW_MS,
  rateLimitMax: parsed.data.RATE_LIMIT_MAX,
  authRateLimitMax: parsed.data.AUTH_RATE_LIMIT_MAX,

  analyticsRetentionDays: parsed.data.ANALYTICS_RETENTION_DAYS,
  analyticsQueueMaxSize: parsed.data.ANALYTICS_QUEUE_MAX_SIZE,
  analyticsFlushIntervalMs: parsed.data.ANALYTICS_FLUSH_INTERVAL_MS,
  analyticsBatchSize: parsed.data.ANALYTICS_BATCH_SIZE,

  shortCodeLength: parsed.data.SHORT_CODE_LENGTH,
  trustProxy: parsed.data.TRUST_PROXY,
};

function parseCsv(value: string) {
  return value
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

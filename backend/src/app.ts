import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { csrfProtection } from './middleware/csrf.middleware.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import { generalLimiter } from './middleware/rateLimiter.middleware.js';
import { notFound } from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { liveness, readiness } from './controllers/health.controller.js';
import { getMetrics } from './controllers/metrics.controller.js';
import redirectRoutes from './routes/redirect.routes.js';
import apiRoutes from './routes/index.js';

const app = express();

if (env.trustProxy) {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(requestLogger);
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.get('/healthz', liveness);
app.get('/readyz', readiness);
app.get('/metrics', getMetrics);
app.use(express.json());
app.use(cookieParser());
app.use('/api', csrfProtection);
app.use(generalLimiter);

// /api is mounted first so its routes are matched before the single-segment
// redirect wildcard below (which would otherwise swallow a bare "/api" request)
app.use('/api', apiRoutes);

// Top-level public redirect route (e.g. GET /abc123)
app.use('/', redirectRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

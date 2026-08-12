import crypto from 'node:crypto';
import { incrementMetric } from '../services/metrics.service.js';
import { logger } from '../utils/logger.js';
import type { RequestHandler } from 'express';

export const requestLogger: RequestHandler = (req, res, next) => {
  const requestId = req.get('x-request-id') || crypto.randomUUID();
  const startedAt = process.hrtime.bigint();

  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    incrementMetric('httpRequestsTotal');
    if (res.statusCode >= 500) {
      incrementMetric('httpErrorsTotal');
    }

    logger.info('http_request', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs),
      ip: req.ip,
      userId: req.user?._id?.toString(),
    });
  });

  next();
};

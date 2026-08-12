import { ApiError } from '../utils/ApiError.js';
import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';

type RequestSource = 'body' | 'query' | 'params';

export function validate(schema: ZodTypeAny, source: RequestSource = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return next(new ApiError(400, 'Validation failed', errors));
    }

    req[source] = result.data;
    next();
  };
}

export class ApiError extends Error {
  statusCode: number;
  errors: Array<{ field?: string; message: string }>;
  isOperational: boolean;

  constructor(statusCode: number, message: string, errors: Array<{ field?: string; message: string }> = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

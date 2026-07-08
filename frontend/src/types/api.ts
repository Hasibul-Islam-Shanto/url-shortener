export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: FieldError[];
}

export class NormalizedApiError extends Error {
  statusCode: number;
  errors?: FieldError[];
  isUnauthorized: boolean;

  constructor(params: {
    statusCode: number;
    message: string;
    errors?: FieldError[];
    isUnauthorized: boolean;
  }) {
    super(params.message);
    this.name = 'NormalizedApiError';
    this.statusCode = params.statusCode;
    this.errors = params.errors;
    this.isUnauthorized = params.isUnauthorized;
  }
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

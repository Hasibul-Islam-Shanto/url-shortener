import axios from 'axios';
import type { AxiosError } from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { NormalizedApiError, type ApiErrorResponse } from '@/types/api';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const statusCode = error.response?.status ?? 0;
    const body = error.response?.data;

    return Promise.reject(
      new NormalizedApiError({
        statusCode,
        message: body?.message ?? 'Something went wrong. Please check your connection and try again.',
        errors: body?.errors,
        isUnauthorized: statusCode === 401,
      })
    );
  }
);

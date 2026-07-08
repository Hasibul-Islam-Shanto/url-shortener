import { axiosClient } from '@/api/axiosClient';
import type { ApiSuccessResponse } from '@/types/api';
import type {
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from '@/features/auth/types';

export async function register(payload: RegisterPayload) {
  const res = await axiosClient.post<ApiSuccessResponse<{ user: User }>>(
    '/api/auth/register',
    payload
  );
  return res.data.data.user;
}

export async function login(payload: LoginPayload) {
  const res = await axiosClient.post<ApiSuccessResponse<{ user: User }>>(
    '/api/auth/login',
    payload
  );
  return res.data.data.user;
}

export async function logout() {
  await axiosClient.post('/api/auth/logout');
}

export async function getMe() {
  const res = await axiosClient.get<ApiSuccessResponse<{ user: User }>>('/api/auth/me');
  return res.data.data.user;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const res = await axiosClient.patch<ApiSuccessResponse<{ user: User }>>(
    '/api/auth/profile',
    payload
  );
  return res.data.data.user;
}

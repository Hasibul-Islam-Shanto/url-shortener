import { createContext } from 'react';
import type { LoginPayload, RegisterPayload, User } from '@/features/auth/types';

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticating: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

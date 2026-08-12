import { useMemo, type ReactNode } from 'react';
import { useMeQuery } from '@/features/auth/api/useMeQuery';
import { useLoginMutation } from '@/features/auth/api/useLoginMutation';
import { useRegisterMutation } from '@/features/auth/api/useRegisterMutation';
import { useLogoutMutation } from '@/features/auth/api/useLogoutMutation';
import { AuthContext, type AuthContextValue } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const meQuery = useMeQuery();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  const value = useMemo<AuthContextValue>(
    () => ({
      user: meQuery.data ?? null,
      isLoading: meQuery.isLoading,
      login: (payload) => loginMutation.mutateAsync(payload),
      register: (payload) => registerMutation.mutateAsync(payload),
      logout: () => logoutMutation.mutateAsync(),
      isAuthenticating:
        loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    }),
    [
      meQuery.data,
      meQuery.isLoading,
      loginMutation,
      registerMutation,
      logoutMutation,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

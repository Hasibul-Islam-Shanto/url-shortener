import { lazy, type ComponentType } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AppLayout } from '@/layouts/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { RootRedirect } from './RootRedirect';

const lazyPage = <T extends Record<string, ComponentType>>(
  loader: () => Promise<T>,
  exportName: keyof T,
) =>
  lazy(() =>
    loader().then((module) => ({
      default: module[exportName],
    })),
  );

const LoginPage = lazyPage(() => import('@/pages/LoginPage'), 'LoginPage');
const RegisterPage = lazyPage(() => import('@/pages/RegisterPage'), 'RegisterPage');
const UrlsListPage = lazyPage(() => import('@/pages/UrlsListPage'), 'UrlsListPage');
const UrlEditPage = lazyPage(() => import('@/pages/UrlEditPage'), 'UrlEditPage');
const UrlDetailsPage = lazyPage(() => import('@/pages/UrlDetailsPage'), 'UrlDetailsPage');
const UrlAnalyticsPage = lazyPage(() => import('@/pages/UrlAnalyticsPage'), 'UrlAnalyticsPage');
const ProfilePage = lazyPage(() => import('@/pages/ProfilePage'), 'ProfilePage');
const SettingsPage = lazyPage(() => import('@/pages/SettingsPage'), 'SettingsPage');
const NotFoundPage = lazyPage(() => import('@/pages/NotFoundPage'), 'NotFoundPage');

export const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <Navigate to="/urls" replace /> },
          { path: '/urls', element: <UrlsListPage /> },
          { path: '/urls/new', element: <Navigate to="/urls" replace /> },
          { path: '/urls/:id', element: <UrlDetailsPage /> },
          { path: '/urls/:id/edit', element: <UrlEditPage /> },
          { path: '/urls/:id/analytics', element: <UrlAnalyticsPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

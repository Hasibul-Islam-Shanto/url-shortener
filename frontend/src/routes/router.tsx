import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AppLayout } from '@/layouts/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { RootRedirect } from './RootRedirect';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { UrlsListPage } from '@/pages/UrlsListPage';
import { UrlCreatePage } from '@/pages/UrlCreatePage';
import { UrlEditPage } from '@/pages/UrlEditPage';
import { UrlDetailsPage } from '@/pages/UrlDetailsPage';
import { UrlAnalyticsPage } from '@/pages/UrlAnalyticsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

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
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/urls', element: <UrlsListPage /> },
          { path: '/urls/new', element: <UrlCreatePage /> },
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

import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Route guards
import PrivateRoute from '@/routes/PrivateRoute';
import RoleGuard from '@/routes/RoleGuard';

// Auth pages (eager loading for critical auth pages)
import LoginPage from '@/features/auth/components/LoginPage';
import RegisterPage from '@/features/auth/components/RegisterPage';

// Other pages (lazy loaded)
const DashboardPage = lazy(() => import('@/features/dashboard/components/DashboardPage'));
const ProfilePage = lazy(() => import('@/features/profile/components/ProfilePage'));
const SettingsPage = lazy(() => import('@/features/settings/components/SettingsPage'));
const AdminPage = lazy(() => import('@/features/admin/components/AdminPage'));
const NotFoundPage = lazy(() => import('@/components/shared/NotFoundPage'));

// Loading fallback
import LoadingFallback from '@/components/shared/LoadingFallback';
import { UserRole } from '@/common/types/auth.types';

const router = createBrowserRouter([
  // Public routes (auth)
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: '/',
        element: <Navigate to="/login\" replace />,
      },
    ],
  },
  
  // Protected routes
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: 'dashboard',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: 'profile',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ProfilePage />
              </Suspense>
            ),
          },
          {
            path: 'settings',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <SettingsPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  
  // Admin routes
  {
    element: <RoleGuard allowedRoles={[UserRole.ROLE_ADMIN]} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: 'admin',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <AdminPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  
  // 404 route
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
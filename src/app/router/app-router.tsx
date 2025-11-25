import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Route guards
import { AuthGuard } from '@/app/router/guards/auth-guard';
import { RoleGuard } from '@/app/router/guards/role-guard';

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

// Medication pages (lazy loaded)
const MedicationList = lazy(() => import('@/features/medications/components/medication-list'));
const MedicationForm = lazy(() => import('@/features/medications/components/medication-form'));


// Caregiver pages (lazy loaded)
const CaregiversPage = lazy(() => import('@/features/caregivers/components/CaregiversPage'));
const PatientsPage = lazy(() => import('@/features/caregivers/components/PatientsPage'));

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
        element: <Navigate to="/login" replace />,
      },
    ],
  },

  // Protected routes
  {
    element: <AuthGuard />,
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
          {
            path: 'medications',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <MedicationList />
              </Suspense>
            ),
          },
          {
            path: 'medications/new',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <MedicationForm />
              </Suspense>
            ),
          },
          {
            path: 'medications/:id/edit',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <MedicationForm />
              </Suspense>
            ),
          },
          {
            path: 'caregivers',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <CaregiversPage />
              </Suspense>
            ),
          },
          {
            path: 'patients',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <PatientsPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  // Admin routes
  {
    element: <RoleGuard allowedRoles={[UserRole.ADMIN]} />,
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
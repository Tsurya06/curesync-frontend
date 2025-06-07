import { Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useGetUserProfileQuery } from '@/features/auth/api/authApi';
import { Loader2 } from 'lucide-react';

const AuthLayout = () => {
  const { data: user, isLoading } = useGetUserProfileQuery();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header with theme toggle and language switcher */}
      <header className="flex h-16 items-center justify-end px-6">
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default AuthLayout;
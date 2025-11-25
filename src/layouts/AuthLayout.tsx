import { Outlet, Link } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useAuth } from '@/lib/hooks';
import { LogOut, Home } from 'lucide-react';

const AuthLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();

  // If already authenticated, show friendly message instead of forcing redirect
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <header className="flex h-16 items-center justify-end px-6">
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center p-4 md:p-8">
          <Card className="mx-auto w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-center text-2xl font-bold">
                Already Logged In
              </CardTitle>
              <CardDescription className="text-center">
                You're logged in as <span className="font-medium text-foreground">{user?.email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link to="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        <footer className="py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </footer>

        <Toaster />
      </div>
    );
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
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default AuthLayout;
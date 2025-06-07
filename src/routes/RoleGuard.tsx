import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserRole } from '@/common/types/auth.types';
import { Loader2 } from 'lucide-react';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
}

const RoleGuard = ({ allowedRoles, redirectTo = '/dashboard' }: RoleGuardProps) => {
  const {user,isAuthenticated,isLoading} = useIsAuthenticated();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user doesn't have required role, redirect
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user has required role, render children routes
  return <Outlet />;
};

export default RoleGuard;
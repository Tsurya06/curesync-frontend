import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';

interface PrivateRouteProps {
  redirectTo?: string;
}

const PrivateRoute = ({ redirectTo = '/login' }: PrivateRouteProps) => {
  const {isAuthenticated,isLoading} = useIsAuthenticated();
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
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated, render children routes
  return <Outlet />;
};

export default PrivateRoute;
import { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/api';
import LoadingFallback from '@/components/shared/LoadingFallback';

interface AuthGuardProps {
	children?: ReactNode;
}

/**
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
export function AuthGuard({ children }: AuthGuardProps) {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return <LoadingFallback />;
	}

	if (!isAuthenticated) {
		// Redirect to login, but save the location they were trying to go to
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return children ? <>{children}</> : <Outlet />;
}

import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/api';
import { UserRole } from '@/common/types/auth.types';
import LoadingFallback from '@/components/shared/LoadingFallback';

interface RoleGuardProps {
	allowedRoles: UserRole[];
	children?: ReactNode;
}

/**
 * Protects routes based on user roles
 * Requires user to be authenticated and have one of the allowed roles
 */
export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
	const { user, isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return <LoadingFallback />;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	const hasRequiredRole = user && allowedRoles.includes(user.role);

	if (!hasRequiredRole) {
		// User doesn't have required role, redirect to dashboard
		return <Navigate to="/dashboard" replace />;
	}

	return children ? <>{children}</> : <Outlet />;
}

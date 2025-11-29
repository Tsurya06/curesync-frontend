import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/common/types/auth.types';
import { storage } from '@/lib/utils/storage';
import { logger } from '@/lib/utils/logger';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api';

import { toast } from 'sonner';

interface AuthContextType {
	user: User | null;
	setUser: (user: User | null) => void;
	isInitialized: boolean;
	logout: () => void;
	isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		// Try to restore user from storage on mount
		const storedUser = storage.get<User>('USER');
		const token = storage.getToken();

		if (storedUser && token) {
			setUser(storedUser);
			logger.info('User restored from storage', { userId: storedUser.id });
		}

		setIsInitialized(true);
	}, []);

	// Listen for logout events from API client
	useEffect(() => {
		const handleLogout = () => {
			setUser(null);
			logger.info('User logged out via event');
		};

		window.addEventListener('auth:logout', handleLogout);
		return () => window.removeEventListener('auth:logout', handleLogout);
	}, []);

	// Sync user to storage when it changes
	useEffect(() => {
		if (user) {
			storage.set('USER', user);
		} else {
			storage.remove('USER');
		}
	}, [user]);

	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const logoutMutation = useMutation({
		mutationFn: async () => {
			return api.post(API_ENDPOINTS.AUTH.LOGOUT);
		},
		onSettled: () => {
			storage.clearAuth();
			setUser(null);
			queryClient.clear();
			navigate('/login');
			toast.success('Logged out successfully');
		},
	});

	const logout = () => logoutMutation.mutate();

	return (
		<AuthContext.Provider value={{
			user,
			setUser,
			isInitialized,
			logout,
			isLoggingOut: logoutMutation.isPending
		}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuthContext must be used within an AuthProvider');
	}
	return context;
}

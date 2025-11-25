import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

/**
 * Default options for all queries and mutations
 */
const queryConfig: DefaultOptions = {
	queries: {
		// Refetch on window focus in production, not in development
		refetchOnWindowFocus: import.meta.env.PROD,
		// Retry failed requests
		retry: (failureCount, error) => {
			// Don't retry on 4xx errors (client errors)
			if (error instanceof AxiosError && error.response) {
				const status = error.response.status;
				if (status >= 400 && status < 500) {
					return false;
				}
			}
			// Retry up to 2 times for other errors
			return failureCount < 2;
		},
		// Stale time - data considered fresh for 5 minutes
		staleTime: 5 * 60 * 1000,
		// Cache time - keep unused data in cache for 10 minutes
		gcTime: 10 * 60 * 1000,
	},
	mutations: {
		// Global error handler for mutations
		onError: (error) => {
			if (error instanceof AxiosError) {
				const message = error.response?.data?.message || error.message || 'An error occurred';
				// Don't show toast for 401 errors (handled by interceptor)
				if (error.response?.status !== 401) {
					toast.error(message);
				}
			} else if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('An unexpected error occurred');
			}
		},
	},
};

/**
 * Create and export query client instance
 */
export const queryClient = new QueryClient({
	defaultOptions: queryConfig,
});

/**
 * Query keys factory for consistent cache keys
 */
export const queryKeys = {
	// Auth
	auth: {
		all: ['auth'] as const,
		user: () => [...queryKeys.auth.all, 'user'] as const,
	},
	// Users
	users: {
		all: ['users'] as const,
		lists: () => [...queryKeys.users.all, 'list'] as const,
		list: (filters: Record<string, unknown>) => [...queryKeys.users.lists(), filters] as const,
		details: () => [...queryKeys.users.all, 'detail'] as const,
		detail: (id: string) => [...queryKeys.users.details(), id] as const,
	},
	// Add more query keys as needed
} as const;

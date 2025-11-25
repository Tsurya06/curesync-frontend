import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/lib/constants/api';
import { storage } from '@/lib/utils/storage';
import { logger } from '@/lib/utils/logger';

/**
 * API Response wrapper type
 */
export interface ApiResponse<T = unknown> {
	data: T;
	message?: string;
	success: boolean;
}

/**
 * API Error type
 */
export interface ApiError {
	message: string;
	code?: string;
	status?: number;
	field?: string;
}

/**
 * Create and configure axios instance with interceptors
 * Uses closure pattern to maintain private state
 */
function createApiClient() {
	// Private state (closures)
	let isRefreshing = false;
	let failedQueue: Array<{
		resolve: (value?: unknown) => void;
		reject: (reason?: unknown) => void;
	}> = [];

	// Create axios instance
	const client: AxiosInstance = axios.create({
		baseURL: API_CONFIG.BASE_URL,
		timeout: API_CONFIG.TIMEOUT,
		headers: {
			'Content-Type': 'application/json',
			'X-Requested-With': 'XMLHttpRequest',
		},
	});

	// Helper: Process queued requests
	function processQueue(error: unknown): void {
		failedQueue.forEach((promise) => {
			if (error) {
				promise.reject(error);
			} else {
				promise.resolve();
			}
		});
		failedQueue = [];
	}

	// Helper: Handle auth failure
	function handleAuthFailure(): void {
		storage.clearAuth();
		// Redirect will be handled by auth context/provider
		window.dispatchEvent(new CustomEvent('auth:logout'));
	}

	// Request interceptor
	client.interceptors.request.use(
		(config: InternalAxiosRequestConfig) => {
			// Add auth token
			const token = storage.getToken();
			if (token && config.headers) {
				config.headers.Authorization = `Bearer ${token}`;
			}

			// Log request in development
			logger.apiRequest(
				config.method?.toUpperCase() || 'GET',
				config.url || '',
				config.data
			);

			return config;
		},
		(error: AxiosError) => {
			logger.apiError('REQUEST', error.config?.url || '', error);
			return Promise.reject(error);
		}
	);

	// Response interceptor
	client.interceptors.response.use(
		(response: AxiosResponse) => {
			// Log response in development
			logger.apiResponse(
				response.config.method?.toUpperCase() || 'GET',
				response.config.url || '',
				response.status,
				response.data
			);

			return response;
		},
		async (error: AxiosError) => {
			const originalRequest = error.config as InternalAxiosRequestConfig & {
				_retry?: boolean;
			};

			// Log error
			logger.apiError(
				originalRequest?.method?.toUpperCase() || 'REQUEST',
				originalRequest?.url || '',
				error
			);

			// Handle 401 - Token expired
			if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
				if (isRefreshing) {
					// Queue the request while token is being refreshed
					return new Promise((resolve, reject) => {
						failedQueue.push({ resolve, reject });
					})
						.then(() => {
							return client(originalRequest);
						})
						.catch((err) => {
							return Promise.reject(err);
						});
				}

				originalRequest._retry = true;
				isRefreshing = true;

				const refreshToken = storage.getRefreshToken();

				if (!refreshToken) {
					handleAuthFailure();
					return Promise.reject(error);
				}

				try {
					// Refresh token
					const response = await client.post<{
						token: string;
						refreshToken: string;
					}>('/api/auth/refresh', { refreshToken });

					const { token, refreshToken: newRefreshToken } = response.data;

					// Update tokens
					storage.setToken(token);
					storage.setRefreshToken(newRefreshToken);

					// Update header for original request
					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `Bearer ${token}`;
					}

					// Process queued requests
					processQueue(null);

					// Retry original request
					return client(originalRequest);
				} catch (refreshError) {
					processQueue(refreshError);
					handleAuthFailure();
					return Promise.reject(refreshError);
				} finally {
					isRefreshing = false;
				}
			}

			return Promise.reject(error);
		}
	);

	// Public API
	return {
		// Convenience methods with typed responses
		get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
			const response = await client.get<T>(url, config);
			return response.data;
		},

		post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
			const response = await client.post<T>(url, data, config);
			return response.data;
		},

		put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
			const response = await client.put<T>(url, data, config);
			return response.data;
		},

		patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
			const response = await client.patch<T>(url, data, config);
			return response.data;
		},

		delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
			const response = await client.delete<T>(url, config);
			return response.data;
		},

		// Get raw axios instance if needed
		getInstance: (): AxiosInstance => client,
	};
}

// Export singleton instance
export const api = createApiClient();

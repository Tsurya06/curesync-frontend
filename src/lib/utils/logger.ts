/**
 * Logging utility for development and production
 * In production, this can be extended to send logs to monitoring services
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
	[key: string]: unknown;
}

const isDevelopment = import.meta.env.DEV;

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
	const timestamp = new Date().toISOString();
	const contextStr = context ? `\n${JSON.stringify(context, null, 2)}` : '';
	return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

export function info(message: string, context?: LogContext): void {
	if (isDevelopment) {
		console.log(formatMessage('info', message, context));
	}
	// In production: send to monitoring service
}

export function warn(message: string, context?: LogContext): void {
	console.warn(formatMessage('warn', message, context));
	// In production: send to monitoring service
}

export function error(message: string, context?: LogContext): void {
	console.error(formatMessage('error', message, context));
	// In production: send to monitoring service (Sentry, LogRocket, etc.)
}

export function debug(message: string, context?: LogContext): void {
	if (isDevelopment) {
		console.debug(formatMessage('debug', message, context));
	}
}

// API-specific logging
export function apiRequest(method: string, url: string, data?: unknown): void {
	debug(`API Request: ${method} ${url}`, { data });
}

export function apiResponse(method: string, url: string, status: number, data?: unknown): void {
	debug(`API Response: ${method} ${url} - ${status}`, { data });
}

export function apiError(method: string, url: string, err: unknown): void {
	error(`API Error: ${method} ${url}`, { error: err });
}

// Export all functions as a single object for backward compatibility
export const logger = {
	info,
	warn,
	error,
	debug,
	apiRequest,
	apiResponse,
	apiError,
};

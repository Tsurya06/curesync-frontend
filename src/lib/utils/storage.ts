/**
 * Storage abstraction layer for localStorage
 * Provides type-safe storage with encryption support potential
 */

const STORAGE_KEYS = {
	ACCESS_TOKEN: '__auth_token__',
	REFRESH_TOKEN: '__auth_refresh__',
	USER: '__auth_user__',
	THEME: '__app_theme__',
} as const;

type StorageKey = keyof typeof STORAGE_KEYS;

/**
 * Get item from localStorage
 */
export function get<T>(key: StorageKey): T | null {
	try {
		const item = localStorage.getItem(STORAGE_KEYS[key]);
		if (!item) return null;
		return JSON.parse(item) as T;
	} catch (error) {
		console.error(`Error reading from storage: ${key}`, error);
		return null;
	}
}

/**
 * Get raw string from localStorage (for tokens)
 */
export function getString(key: StorageKey): string | null {
	try {
		return localStorage.getItem(STORAGE_KEYS[key]);
	} catch (error) {
		console.error(`Error reading string from storage: ${key}`, error);
		return null;
	}
}

/**
 * Set item in localStorage
 */
export function set<T>(key: StorageKey, value: T): void {
	try {
		localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
	} catch (error) {
		console.error(`Error writing to storage: ${key}`, error);
	}
}

/**
 * Set raw string in localStorage (for tokens)
 */
export function setString(key: StorageKey, value: string): void {
	try {
		localStorage.setItem(STORAGE_KEYS[key], value);
	} catch (error) {
		console.error(`Error writing string to storage: ${key}`, error);
	}
}

/**
 * Remove item from localStorage
 */
export function remove(key: StorageKey): void {
	try {
		localStorage.removeItem(STORAGE_KEYS[key]);
	} catch (error) {
		console.error(`Error removing from storage: ${key}`, error);
	}
}

/**
 * Clear all app data from localStorage
 */
export function clear(): void {
	try {
		Object.values(STORAGE_KEYS).forEach((key) => {
			localStorage.removeItem(key);
		});
	} catch (error) {
		console.error('Error clearing storage', error);
	}
}

// Convenience methods for auth tokens
export function getToken(): string | null {
	return getString('ACCESS_TOKEN');
}

export function setToken(token: string): void {
	setString('ACCESS_TOKEN', token);
}

export function getRefreshToken(): string | null {
	return getString('REFRESH_TOKEN');
}

export function setRefreshToken(token: string): void {
	setString('REFRESH_TOKEN', token);
}

export function clearAuth(): void {
	remove('ACCESS_TOKEN');
	remove('REFRESH_TOKEN');
	remove('USER');
}

// Export all functions as a single object for backward compatibility
export const storage = {
	get,
	getString,
	set,
	setString,
	remove,
	clear,
	getToken,
	setToken,
	getRefreshToken,
	setRefreshToken,
	clearAuth,
};

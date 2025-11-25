import { useState } from 'react';

const STORAGE_KEY = 'curesync_mock_mode';

// Helper to check mode outside of React components (synchronous)
export const isMockMode = (): boolean => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		// Default to false if not set
		return stored === 'true';
	} catch (e) {
		console.warn('Failed to read mock mode from storage', e);
		return false;
	}
};

// Hook for React components to view/toggle mode
export const useApiConfig = () => {
	// Initialize state from local storage
	const [isMock, setIsMock] = useState(isMockMode());

	const toggleMockMode = () => {
		const newValue = !isMock;
		setIsMock(newValue);
		localStorage.setItem(STORAGE_KEY, String(newValue));

		// Optional: Reload page to ensure all queries re-fetch with new mode
		// window.location.reload(); 
		// Or we can just let React Query handle refetching if we invalidate queries
	};

	return {
		isMockMode: isMock,
		toggleMockMode
	};
};

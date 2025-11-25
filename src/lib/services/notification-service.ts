import { Workbox } from 'workbox-window';

// API endpoint configuration - ready for backend integration



interface PushSubscriptionData {
	endpoint: string;
	keys: {
		p256dh: string;
		auth: string;
	};
}

export const NotificationService = {
	workbox: null as Workbox | null,

	/**
	 * Initialize service worker for background notifications
	 */
	initServiceWorker: async (): Promise<boolean> => {
		if ('serviceWorker' in navigator) {
			try {
				const wb = new Workbox('/sw.js');
				NotificationService.workbox = wb;

				wb.addEventListener('installed', (event) => {
					if (event.isUpdate) {
						console.log('New service worker installed, reloading...');
						window.location.reload();
					}
				});

				await wb.register();
				console.log('Service Worker registered successfully');
				return true;
			} catch (error) {
				console.error('Service Worker registration failed:', error);
				return false;
			}
		}
		return false;
	},

	/**
	 * Request notification permission from user
	 */
	requestPermission: async (): Promise<boolean> => {
		if (!('Notification' in window)) {
			console.warn('This browser does not support desktop notification');
			return false;
		}

		if (Notification.permission === 'granted') {
			return true;
		}

		if (Notification.permission !== 'denied') {
			const permission = await Notification.requestPermission();
			if (permission === 'granted') {
				// Subscribe to push notifications after permission granted
				await NotificationService.subscribeToPush();
				return true;
			}
		}

		return false;
	},

	/**
	 * Subscribe to push notifications (backend integration point)
	 */
	subscribeToPush: async (): Promise<void> => {
		try {
			const registration = await navigator.serviceWorker.ready;

			// Get or create push subscription
			let subscription = await registration.pushManager.getSubscription();

			if (!subscription) {
				// Create new subscription
				const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

				if (!vapidPublicKey) {
					console.warn('VAPID public key not configured. Push notifications will use local scheduling only.');
					return;
				}

				subscription = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as unknown as BufferSource
				});
			}

			if (subscription) {
				// Send subscription to backend
				const subscriptionData: PushSubscriptionData = {
					endpoint: subscription.endpoint,
					keys: {
						p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
						auth: arrayBufferToBase64(subscription.getKey('auth')!)
					}
				};

				// TODO: Send to backend when available
				await sendSubscriptionToBackend(subscriptionData);
			}
		} catch (error) {
			console.error('Failed to subscribe to push notifications:', error);
		}
	},

	/**
	 * Send immediate notification
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	sendNotification: (title: string, body?: string, data?: any) => {
		if (Notification.permission === 'granted') {
			if (navigator.serviceWorker && navigator.serviceWorker.controller) {
				// Use service worker for background notifications
				navigator.serviceWorker.controller.postMessage({
					type: 'SHOW_NOTIFICATION',
					payload: { title, body, data }
				});
			} else {
				// Fallback to regular notification
				new Notification(title, {
					body,
					icon: '/icons/icon-192x192.png',
					badge: '/icons/icon-192x192.png',
					data
				});
			}
		}
	},

	/**
	 * Schedule notification (mock - will be replaced by backend)
	 * In production, this should call backend API to schedule
	 */
	scheduleNotification: async (
		id: string,
		time: Date,
		title: string,
		body?: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data?: any
	): Promise<void> => {
		const now = new Date();
		const delay = time.getTime() - now.getTime();

		if (delay > 0) {
			// For now, use setTimeout for demo
			// TODO: Replace with backend API call when available
			console.log(`Scheduling notification "${title}" in ${delay}ms`);

			// Store in IndexedDB for persistence (will survive page refresh)
			await storeScheduledNotification({
				id,
				time: time.toISOString(),
				title,
				body,
				data
			});

			// If service worker is active, send schedule command
			if (navigator.serviceWorker && navigator.serviceWorker.controller) {
				navigator.serviceWorker.controller.postMessage({
					type: 'SCHEDULE_NOTIFICATION',
					payload: {
						id,
						time: time.toISOString(),
						title,
						body,
						data
					}
				});
			} else {
				// Fallback to setTimeout (won't persist on reload)
				setTimeout(() => {
					NotificationService.sendNotification(title, body, data);
				}, delay);
			}
		}
	},

	/**
	 * Cancel scheduled notification
	 */
	cancelNotification: async (id: string): Promise<void> => {
		// TODO: Call backend API to cancel
		console.log(`Cancelling notification ${id}`);

		if (navigator.serviceWorker && navigator.serviceWorker.controller) {
			navigator.serviceWorker.controller.postMessage({
				type: 'CANCEL_NOTIFICATION',
				payload: { id }
			});
		}
	},

	/**
	 * Send missed dose notification to caregiver (backend integration point)
	 */
	notifyCaregiver: async (

		medicationName: string,
		doseTime: Date
	): Promise<void> => {
		try {
			// TODO: Call backend API to notify caregiver
			console.log(`Notifying caregiver about missed dose: ${medicationName} at ${doseTime}`);

			// This will be implemented with backend API
			// await fetch(`${API_BASE_URL}/notifications/caregiver`, {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify({ patientId, medicationName, doseTime })
			// });
		} catch (error) {
			console.error('Failed to notify caregiver:', error);
		}
	}
};

// Helper functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
	let binary = '';
	const bytes = new Uint8Array(buffer);
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
}

async function sendSubscriptionToBackend(subscription: PushSubscriptionData): Promise<void> {
	try {
		// TODO: Implement backend call when API is ready
		console.log('Subscription ready for backend:', subscription);

		// Example implementation:
		// const response = await fetch(NOTIFICATION_ENDPOINT, {
		//   method: 'POST',
		//   headers: {
		//     'Content-Type': 'application/json',
		//     'Authorization': `Bearer ${getAuthToken()}`
		//   },
		//   body: JSON.stringify(subscription)
		// });

		// if (!response.ok) {
		//   throw new Error('Failed to send subscription to backend');
		// }
	} catch (error) {
		console.error('Backend subscription failed:', error);
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function storeScheduledNotification(notification: any): Promise<void> {
	// Store in IndexedDB for persistence
	const dbName = 'medication-notifications';
	const storeName = 'scheduled';

	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName, 1);

		request.onerror = () => reject(request.error);

		request.onsuccess = () => {
			const db = request.result;
			const transaction = db.transaction(storeName, 'readwrite');
			const store = transaction.objectStore(storeName);
			store.put(notification);
			transaction.oncomplete = () => resolve();
		};

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains(storeName)) {
				db.createObjectStore(storeName, { keyPath: 'id' });
			}
		};
	});
}

export default NotificationService;

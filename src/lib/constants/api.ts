/**
 * API configuration and endpoint constants
 * Based on backend API specification
 * Swagger UI: http://localhost:8080/swagger-ui.html
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:8080',
  TIMEOUT: 30000, // 30 seconds
} as const;

export const API_ENDPOINTS = {
  // Auth endpoints (/api/auth)
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
    VERIFY_EMAIL: '/api/auth/verify-email',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },

  // User Profile endpoints (/api/users)
  USERS: {
    ME: '/api/users/profile',
    UPDATE_ME: '/api/users/profile',
    UPLOAD_PICTURE: '/api/users/profile-picture',
    CHANGE_PASSWORD: '/api/users/change-password',
    LIST: '/api/users',
    DETAIL: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
  },

  // Medications endpoints (/api/medications)
  MEDICATIONS: {
    BASE: '/api/medications',
    BY_ID: (id: string) => `/api/medications/${id}`,
    UPLOAD_IMAGE: (id: string) => `/api/medications/${id}/image`,
    // Supports ?patientId= parameter for caregiver access
    // Supports pagination and filtering by status
  },

  // Dose Tracking endpoints (/api/doses)
  DOSES: {
    BASE: '/api/doses',
    SCHEDULE: '/api/doses/schedule',
    LOG: (id: string) => `/api/doses/${id}/log`,
    DELETE: (id: string) => `/api/doses/${id}`,
    HISTORY: '/api/doses/history', // Deprecated?
    UPCOMING: '/api/doses/upcoming', // Deprecated?
    BY_ID: (id: string) => `/api/doses/${id}`,
  },

  // Analytics endpoints (/api/analytics)
  ANALYTICS: {
    ADHERENCE: '/api/analytics/adherence',
    TRENDS: '/api/analytics/trends',
  },

  // Settings endpoints (/api/settings)
  SETTINGS: {
    BASE: '/api/settings',
    GET: '/api/settings',
    UPDATE: '/api/settings',
  },

  // Notifications endpoints (/api/notifications)
  NOTIFICATIONS: {
    SUBSCRIBE: '/api/notifications/subscribe',
    UNSUBSCRIBE: '/api/notifications/unsubscribe',
    PREFERENCES: '/api/notifications/preferences',
  },

  // Caregiver endpoints (/api/caregivers)
  CAREGIVERS: {
    BASE: '/api/caregivers',
    INVITE: '/api/caregivers/invite',
    ACCEPT: (id: string) => `/api/caregivers/${id}/accept`,
    REJECT: (id: string) => `/api/caregivers/${id}/reject`,
    PATIENTS: '/api/caregivers/patients',
    MY_CAREGIVERS: '/api/caregivers/my-caregivers',
    RELATIONSHIPS: '/api/caregivers/relationships', // Deprecated?
    BY_ID: (id: string) => `/api/caregivers/${id}`,
    REMOVE: (id: string) => `/api/caregivers/${id}`,
  },
} as const;

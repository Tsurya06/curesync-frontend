// import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// import { store } from '@/store';
// import { logout } from '@/features/auth/store/authSlice';
// import { getTokenFromStorage, getRefreshTokenFromStorage } from '@/services/token/tokenService';
// import { refreshTokens } from '@/features/auth/store/authThunks';

// const API_URL = import.meta.env.VITE_BASE_URL;

// // Create axios instance
// const apiClient: AxiosInstance = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor for API calls
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = getTokenFromStorage();
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for API calls
// apiClient.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
//     // Handle unauthorized errors - try to refresh token
//     if (
//       error.response?.status === 401 &&
//       originalRequest &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
      
//       try {
//         const refreshToken = getRefreshTokenFromStorage();
        
//         if (!refreshToken) {
//           // No refresh token available, force logout
//           store.dispatch(logout());
//           return Promise.reject(error);
//         }
        
//         // Try to get a new token
//         const response = await store.dispatch(refreshTokens(refreshToken)).unwrap();
        
//         if (response.token) {
//           // Retry the original request with new token
//           if (originalRequest.headers) {
//             originalRequest.headers.Authorization = `Bearer ${response.token}`;
//           }
//           return apiClient(originalRequest);
//         }
//       } catch (refreshError) {
//         // Refresh token failed, force logout
//         store.dispatch(logout());
//         return Promise.reject(refreshError);
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default apiClient;
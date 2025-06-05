// Token storage keys
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

// Get token from storage
export const getTokenFromStorage = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Get refresh token from storage
export const getRefreshTokenFromStorage = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Set token in storage
export const setTokenInStorage = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Set refresh token in storage
export const setRefreshTokenInStorage = (refreshToken: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

// Remove tokens from storage
export const removeTokensFromStorage = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// // Check if token is expired
// export const isTokenExpired = (token: string): boolean => {
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     const expiry = payload.exp * 1000; // Convert to milliseconds
//     return Date.now() >= expiry;
//   } catch (error) {
//     return true; // If there's an error parsing, assume token is expired
//   }
// };

// Decode JWT token and extract user info
// export const decodeToken = (token: string): any => {
//   try {
//     return JSON.parse(atob(token.split('.')[1]));
//   } catch (error) {
//     return null;
//   }
// };
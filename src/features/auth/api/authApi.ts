import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  RefreshTokenResponse,
  User
} from '@/common/types/auth.types';
import { getTokenFromStorage } from '@/services/token/tokenService';

// RTK Query API definition
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = getTokenFromStorage();
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/v1/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    
    refreshToken: builder.mutation<RefreshTokenResponse, string>({
      query: (refreshToken) => ({
        url: '/v1/auth/refresh-token',
        method: 'POST',
        body: { refreshToken },
      }),
    }),
    
    getUserProfile: builder.query<User, void>({
      query: () => '/v1/auth/me',
    }),
    
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/v1/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useGetUserProfileQuery,
  useLogoutMutation,
} = authApi;
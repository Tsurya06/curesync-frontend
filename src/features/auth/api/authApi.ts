import { api } from '@/services/api';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  RefreshTokenResponse,
  User,
  UpdateProfileData
} from '@/common/types/auth.types';
import { getRefreshTokenFromStorage, setTokenInStorage, setRefreshTokenInStorage } from '@/services/token/tokenService';

// RTK Query API definition
export const authApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: { data: { token: string; refreshToken: string; user: User } }) => ({
        accessToken: response.data.token,
        refreshToken: response.data.refreshToken,
        user: response.data.user,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          setTokenInStorage(data.accessToken);
          setRefreshTokenInStorage(data.refreshToken);
        } catch (e:any){
          console.error(e.message);
        }
      },
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
      transformResponse: (response: { data: User }) => response.data,
      providesTags: ['User'],
    }),
    
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/v1/auth/logout',
        method: 'POST',
        body: { refreshToken: getRefreshTokenFromStorage() },
      }),
      invalidatesTags: ['User'],
    }),
    
    updateProfile: builder.mutation<User, UpdateProfileData>({
      query: (data) => ({
        url: '/v1/profile/update',
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: { data: User }) => response.data,
      invalidatesTags: ['User'],
    }),
    
    updatePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (data) => ({
        url: '/v1/auth/update-password',
        method: 'PUT',
        body: data,
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
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} = authApi;
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  RefreshTokenResponse, 
  LogoutRequest,
  User,
  UpdateProfileData
} from '@/common/types/auth.types';
import { 
  setTokenInStorage, 
  setRefreshTokenInStorage, 
  removeTokensFromStorage,
  getTokenFromStorage,
  getRefreshTokenFromStorage,
} from '@/services/token/tokenService';
import apiClient from '@/services/apiClient';

export type AuthState ={
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: getTokenFromStorage(),
  refreshToken: getRefreshTokenFromStorage(),
  isAuthenticated: !!getTokenFromStorage(),
  isLoading: false,
  error: null,
};

// Async thunks
type ApiResponse<T> ={
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const login = createAsyncThunk<LoginResponse, LoginRequest>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>('v1/auth/login', credentials);
      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Login failed');
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);
export const logoutUser = createAsyncThunk<{}, LogoutRequest>(
  'auth/logout',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('v1/auth/logout', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const register = createAsyncThunk<LoginResponse, RegisterRequest>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>('v1/auth/register', userData);
      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Registration failed');
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const refreshTokens = createAsyncThunk<RefreshTokenResponse, string>(
  'auth/refreshTokens',
  async (refreshToken, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>('v1/auth/refresh-token', { refreshToken });
      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Token refresh failed');
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<ApiResponse<User>>('v1/auth/me');
      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Failed to fetch user profile');
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

export const updateProfile = createAsyncThunk<User, UpdateProfileData>(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch<ApiResponse<User>>('/v1/profile/update', profileData);
      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Failed to update profile');
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const updatePassword = createAsyncThunk<void, { currentPassword: string; newPassword: string }>(
  'auth/updatePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch<ApiResponse<void>>('/v1/users/me/password', {
        currentPassword,
        newPassword,
      });
      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Failed to update password');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update password');
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { dispatch, rejectWithValue }) => {
    const token = getTokenFromStorage();
    if (!token) {
      return rejectWithValue('No authentication token found');
    }

    try {
      const userData = await dispatch(fetchUserProfile()).unwrap();
      return userData;
    } catch (error: any) {
      removeTokensFromStorage();
      return rejectWithValue(error.message || 'Failed to authenticate with stored token');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      removeTokensFromStorage();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        setTokenInStorage(action.payload.token);
        setRefreshTokenInStorage(action.payload.refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        removeTokensFromStorage();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        removeTokensFromStorage();
      })

      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        setTokenInStorage(action.payload.token);
        setRefreshTokenInStorage(action.payload.refreshToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Refresh tokens
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.accessToken = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        setTokenInStorage(action.payload.token);
        setRefreshTokenInStorage(action.payload.refreshToken);
      })
      .addCase(refreshTokens.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        removeTokensFromStorage();
      })
      
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Check auth status
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        removeTokensFromStorage();
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
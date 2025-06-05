import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  AuthState, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  RefreshTokenResponse, 
  LogoutRequest
} from '@/common/types/auth.types';
import { 
  setTokenInStorage, 
  setRefreshTokenInStorage, 
  removeTokensFromStorage,
  getTokenFromStorage,
  getRefreshTokenFromStorage,
} from '@/services/token/tokenService';
import apiClient from '@/services/apiClient';

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
export const login = createAsyncThunk<LoginResponse, LoginRequest>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<LoginResponse>('v1/auth/login', credentials);
      return response.data;
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
      const response = await apiClient.post<LoginResponse>('v1/auth/register', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const refreshTokens = createAsyncThunk<RefreshTokenResponse, string>(
  'auth/refreshTokens',
  async (refreshToken, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<RefreshTokenResponse>('v1/auth/refresh', { refreshToken });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('v1/auth/me');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
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
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
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
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
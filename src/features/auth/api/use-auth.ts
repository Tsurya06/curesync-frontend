import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api';
import { storage } from '@/lib/utils/storage';
import { useAuthContext } from '@/app/providers/auth-provider';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  UserRole,
} from '@/common/types/auth.types';




const queryKeys = {
  auth: {
    user: () => ['auth', 'user'] as const,
  },
};

export function useLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      return api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    },
    onSuccess: (data) => {
      storage.setToken(data.token);
      storage.setRefreshToken(data.refreshToken);
      setUser(data.user);
      toast.success('Welcome back!');

      // Smart redirect based on role
      if (data.user.role === UserRole.CAREGIVER) {
        navigate('/dashboard');
      } else {
        navigate('/medications');
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'Login failed');
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      return api.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    },
    onSuccess: (data) => {
      storage.setToken(data.token);
      storage.setRefreshToken(data.refreshToken);
      setUser(data.user);
      toast.success('Account created successfully');
      navigate('/medications');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'Registration failed');
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return api.post(API_ENDPOINTS.AUTH.LOGOUT);
    },
    onSuccess: () => {
      storage.clearAuth();
      setUser(null);
      queryClient.clear();
      navigate('/login');
      toast.success('Logged out successfully');
    },
    onError: () => {
      // Even if API fails, we should clear local state
      storage.clearAuth();
      setUser(null);
      queryClient.clear();
      navigate('/login');
    },
  });
}

export function useAuthUser() {
  const { setUser } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async () => {

      const userData = await api.get<User>(API_ENDPOINTS.AUTH.ME);
      setUser(userData);
      return userData;
    },
    retry: false,
    enabled: !!storage.getToken(),
  });
}

/**
 * Composite hook for auth state and actions
 * Used by components that need user state and logout capability
 */
export function useAuth() {
  const { user, isInitialized, logout, isLoggingOut } = useAuthContext();

  return {
    user,
    isAuthenticated: !!user,
    isLoading: !isInitialized,
    logout,
    isLoggingOut
  };
}

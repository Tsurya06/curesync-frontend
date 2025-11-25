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
import { isMockMode } from '@/lib/api-config';
import { MOCK_USERS } from '@/lib/mock-data';

// Helper for delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
      if (isMockMode()) {
        await delay(800);
        const user = MOCK_USERS.find(u => u.email === credentials.email);

        if (!user) {
          throw new Error('Invalid credentials');
        }

        // Mock response
        return {
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
          user: user
        } as LoginResponse;
      }
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
      if (isMockMode()) {
        await delay(1000);
        // Check if email exists
        if (MOCK_USERS.some(u => u.email === data.email)) {
          throw new Error('Email already registered');
        }

        const newUser: User = {
          id: Date.now(),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: UserRole.PATIENT, // Default to patient for now
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        MOCK_USERS.push(newUser);

        return {
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
          user: newUser
        } as RegisterResponse;
      }
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
      if (isMockMode()) {
        await delay(500);
        return;
      }
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
      if (isMockMode()) {
        await delay(500);
        // Return the first mock user as the "logged in" user if token exists
        if (storage.getToken()) {
          // In a real mock, we might decode the token or store the user ID in local storage
          // For now, just return the first user
          const user = MOCK_USERS[0];
          setUser(user);
          return user;
        }
        throw new Error('No token found');
      }
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
  const { user, isInitialized } = useAuthContext();
  const logoutMutation = useLogout();

  return {
    user,
    isAuthenticated: !!user,
    isLoading: !isInitialized,
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending
  };
}

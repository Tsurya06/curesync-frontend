import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api';
import { User } from '@/common/types/auth.types';
import { UpdateProfileRequest, ChangePasswordRequest } from '@/common/types/user.types';
import { isMockMode } from '@/lib/api-config';
import { useAuthContext } from '@/app/providers/auth-provider';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getProfile = async (): Promise<User> => {
  if (isMockMode()) {
    await delay(500);
    // This should ideally return the current user from mock data
    // For now, we rely on useAuthUser which handles this
    throw new Error('Not implemented in mock mode, use useAuthUser');
  }
  return api.get<User>(API_ENDPOINTS.USERS.ME);
};

const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
  if (isMockMode()) {
    await delay(800);
    // Mock update
    return {
      id: 1,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'PATIENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as User;
  }
  return api.put<User>(API_ENDPOINTS.USERS.UPDATE_ME, data);
};

const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  if (isMockMode()) {
    await delay(800);
    return;
  }
  return api.post<void>(API_ENDPOINTS.USERS.CHANGE_PASSWORD, data);
};

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthContext();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: () => {
      toast.error('Failed to change password');
    },
  });
}

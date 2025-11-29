import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api';
import { User } from '@/common/types/auth.types';
import { UpdateProfileRequest, ChangePasswordRequest } from '@/common/types/user.types';
import { useAuthContext } from '@/app/providers/auth-provider';


const getProfile = async (): Promise<User> => {

  return api.get<User>(API_ENDPOINTS.USERS.ME);
};

const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {

  return api.put<User>(API_ENDPOINTS.USERS.UPDATE_ME, data);
};

const changePassword = async (data: ChangePasswordRequest): Promise<void> => {

  return api.post<void>(API_ENDPOINTS.USERS.CHANGE_PASSWORD, data);
};

const uploadProfilePicture = async (file: File): Promise<User> => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post<User>(API_ENDPOINTS.USERS.UPLOAD_PICTURE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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

export function useUploadProfilePicture() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthContext();

  return useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      toast.success('Profile picture updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile picture');
    },
  });
}

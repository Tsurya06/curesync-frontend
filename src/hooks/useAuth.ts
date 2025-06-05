import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  login, 
  register, 
  logout, 
  fetchUserProfile, 
  logoutUser
} from '@/features/auth/store/authSlice';
import type { LoginRequest, RegisterRequest, User } from '@/common/types/auth.types';
import { getRefreshTokenFromStorage } from '@/services/token/tokenService';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);
  
  const loginUser = useCallback(
    async (credentials: LoginRequest) => {
      try {
        await dispatch(login(credentials)).unwrap();
        return true;
      } catch (err) {
        return false;
      }
    },
    [dispatch]
  );
  
  const registerUser = useCallback(
    async (userData: RegisterRequest) => {
      try {
        await dispatch(register(userData)).unwrap();
        return true;
      } catch (err) {
        return false;
      }
    },
    [dispatch]
  );
  
  const logOut = useCallback(async() => {
    try {
      await dispatch(logoutUser({ refreshToken: getRefreshTokenFromStorage() })).unwrap();
    } catch (error) {
      // Even if server logout fails, ensure local logout
      dispatch(logout());
    }
  }, [dispatch]);
  
  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    if (user) return user;
    
    try {
      const result = await dispatch(fetchUserProfile()).unwrap();
      return result;
    } catch (err) {
      return null;
    }
  }, [dispatch, user]);
  
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginUser,
    registerUser,
    logOut,
    getCurrentUser,
  };
};
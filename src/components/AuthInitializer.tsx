import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { checkAuthStatus } from '@/features/auth/store/authSlice';

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await dispatch(checkAuthStatus()).unwrap();
      } catch (error) {
        console.log('No valid session found');
      }
    };

    initializeAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthInitializer;

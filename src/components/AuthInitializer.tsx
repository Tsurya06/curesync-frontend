import { useGetUserProfileQuery } from '@/features/auth/api/authApi';
import { Loader2 } from 'lucide-react';

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useGetUserProfileQuery();
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;

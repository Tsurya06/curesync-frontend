import { useGetUserProfileQuery } from "@/features/auth/api/authApi";

export const useIsAuthenticated = () => {
    const { data: user, isLoading } = useGetUserProfileQuery();
    return { user, isAuthenticated: Boolean(user), isLoading };
  };
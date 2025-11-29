export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  PATIENT = 'PATIENT',
  CAREGIVER = 'CAREGIVER',
}

export type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type LoginRequest = {
  email: string;
  password: string;
}

export type LogoutRequest = {
  refreshToken?: string | null;
}

export type LoginResponse = {
  user: User;
  token: string;
  refreshToken: string;
}

export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type RegisterResponse = LoginResponse;

export type RefreshTokenRequest = {
  refreshToken: string;
}

export type RefreshTokenResponse = {
  token: string;
  refreshToken: string;
}
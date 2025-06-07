export type User ={
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  bio?:string;
}

export enum UserRole {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_USER = 'ROLE_USER',
}

export type LoginRequest ={
  email: string;
  password: string;
}
export type LogoutRequest ={
  refreshToken?: string | null;
}

export type LoginResponse ={
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type RegisterRequest ={
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type RefreshTokenRequest ={
  refreshToken: string;
}

export type RefreshTokenResponse ={
  token: string;
  refreshToken: string;
}

export type UpdateProfileData = {
  firstName: string;
  lastName: string;
  bio?: string;
};
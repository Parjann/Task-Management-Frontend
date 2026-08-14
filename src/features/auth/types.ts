export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  isGuest?: boolean;
  theme?: 'SYSTEM' | 'LIGHT' | 'DARK';
  accentColor?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  message: string;
  user: User;
  accessToken: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface GuestLoginDto {
  name?: string;
}

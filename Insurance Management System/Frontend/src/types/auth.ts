export type Role = 'ADMIN' | 'USER';

export interface AuthUser {
  token: string;
  role: Role;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}
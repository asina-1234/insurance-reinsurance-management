import axiosClient from './axiosClient';
import type { ApiResponse } from '../types/api';
import type { AuthUser, LoginRequest, RegisterRequest } from '../types/auth';

export const authApi = {
  register: (data: RegisterRequest) =>
    axiosClient.post<ApiResponse<null>>('/auth/register', data),

  login: (data: LoginRequest) =>
    axiosClient.post<ApiResponse<AuthUser>>('/auth/login', data),
};
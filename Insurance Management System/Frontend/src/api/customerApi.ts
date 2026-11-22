import axiosClient from './axiosClient';
import type { ApiResponse } from '../types/api';
import type { Profile } from '../types/customer';

export const customerApi = {
  getProfile: () => axiosClient.get<ApiResponse<Profile>>('/customer/me'),
};
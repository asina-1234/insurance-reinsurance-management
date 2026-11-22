import axiosClient from './axiosClient';
import type { ApiResponse } from '../types/api';
import type { Dashboard } from '../types/dashboard';

export const dashboardApi = {
  get: () => axiosClient.get<ApiResponse<Dashboard>>('/admin/dashboard'),
};
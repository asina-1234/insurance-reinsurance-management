import axiosClient from './axiosClient';
import type { ApiResponse } from '../types/api';
import type { CreatePolicyRequest, Policy, PolicyTypeOption } from '../types/policy';

export const policyApi = {
  getCatalog: () => axiosClient.get<ApiResponse<PolicyTypeOption[]>>('/policies/catalog'),

  getMyPolicies: () => axiosClient.get<ApiResponse<Policy[]>>('/policies'),

  create: (data: CreatePolicyRequest) =>
    axiosClient.post<ApiResponse<Policy>>('/policies', data),
};
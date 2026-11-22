import axiosClient from './axiosClient';
import type { ApiResponse } from '../types/api';
import type { Claim, ClaimLimit, CreateClaimRequest } from '../types/claim';

export const claimApi = {
  getMyClaims: () => axiosClient.get<ApiResponse<Claim[]>>('/claims'),

  getLimit: (policyId: number) =>
    axiosClient.get<ApiResponse<ClaimLimit>>(`/claims/policies/${policyId}/limit`),

  create: (data: CreateClaimRequest) =>
    axiosClient.post<ApiResponse<Claim>>('/claims', data),
};
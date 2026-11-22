import axiosClient from './axiosClient';
import type { ApiResponse } from '../types/api';
import type { AdminClaim, AdminCustomer, AdminPolicy } from '../types/admin';
import type { ClaimStatus } from '../types/claim';
import type { PolicyStatus } from '../types/policy';
import type { NonProportionalTreaty, ProportionalTreaty } from '../types/treaty';

export const adminApi = {
  getCustomers: () => axiosClient.get<ApiResponse<AdminCustomer[]>>('/admin/customers'),
  getCustomerPolicies: (customerId: number) =>
    axiosClient.get<ApiResponse<AdminPolicy[]>>(`/admin/customers/${customerId}/policies`),
  getCustomerClaims: (customerId: number) =>
    axiosClient.get<ApiResponse<AdminClaim[]>>(`/admin/customers/${customerId}/claims`),

  getPolicies: () => axiosClient.get<ApiResponse<AdminPolicy[]>>('/admin/policies'),
  getPolicyClaims: (policyId: number) =>
    axiosClient.get<ApiResponse<AdminClaim[]>>(`/admin/policies/${policyId}/claims`),
  updatePolicyStatus: (policyId: number, status: PolicyStatus) =>
    axiosClient.patch<ApiResponse<AdminPolicy>>(`/admin/policies/${policyId}/status`, { status }),

  getClaims: () => axiosClient.get<ApiResponse<AdminClaim[]>>('/admin/claims'),
  updateClaimStatus: (claimId: number, status: ClaimStatus) =>
    axiosClient.patch<ApiResponse<AdminClaim>>(`/admin/claims/${claimId}/status`, { status }),

  getProportionalTreaty: () =>
    axiosClient.get<ApiResponse<ProportionalTreaty>>('/admin/proportional-treaty'),
  getNonProportionalTreaty: () =>
    axiosClient.get<ApiResponse<NonProportionalTreaty>>('/admin/non-proportional-treaty'),
};
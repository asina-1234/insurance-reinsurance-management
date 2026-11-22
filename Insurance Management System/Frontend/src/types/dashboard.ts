import type { ClaimStatus } from './claim';
import type { AllocationType } from './treaty';

export interface MonthlyCount {
  month: string;
  label: string;
  count: number;
}

export interface PolicyTypeTotal {
  policyType: string;
  sumInsured: number;
  premium: number;
}

export interface ClaimStatusTotal {
  status: ClaimStatus;
  count: number;
  amount: number;
}

export interface ProportionalShare {
  allocationType: AllocationType;
  retention: number;
  quotaShare: number;
  surplus: number;
}

export interface Dashboard {
  customersPerMonth: MonthlyCount[];
  policyByType: PolicyTypeTotal[];
  claimsByStatus: ClaimStatusTotal[];
  proportionalShare: ProportionalShare[];
}
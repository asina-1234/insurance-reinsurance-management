export type PolicyStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'EXPIRED';

export interface Policy {
  policyId: number;
  policyNumber: string;
  policyType: string;
  addons: string | null;
  sumInsured: number;
  premium: number;
  startDate: string;
  endDate: string;
  status: PolicyStatus;
}

export interface AddOnOption {
  name: string;
  percentage: number;
}

export interface PolicyTypeOption {
  code: string;
  label: string;
  baseRatePercent: number;
  addOns: AddOnOption[];
}

export interface CreatePolicyRequest {
  policyType: string;
  addons: string[];
  sumInsured: number;
}
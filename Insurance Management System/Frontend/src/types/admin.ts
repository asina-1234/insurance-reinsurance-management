import type { ClaimStatus } from './claim';
import type { PolicyStatus } from './policy';

export interface AdminCustomer {
  customerId: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  registrationDate: string;
  policiesCount: number;
  claimsCount: number;
}

export interface AdminPolicy {
  policyId: number;
  policyNumber: string;
  customerId: number;
  customerName: string;
  policyType: string;
  addons: string | null;
  sumInsured: number;
  premium: number;
  startDate: string;
  endDate: string;
  status: PolicyStatus;
  claimsCount: number;
}

export interface AdminClaim {
  claimId: number;
  claimNumber: string;
  policyId: number;
  policyNumber: string;
  customerId: number;
  customerName: string;
  claimAmount: number;
  approvedAmount: number | null;
  incidentDate: string;
  reason: string;
  status: ClaimStatus;
  submittedDate: string;
}
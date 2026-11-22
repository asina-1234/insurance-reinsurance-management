export type ClaimStatus = 'SUBMITTED' | 'APPROVED' | 'SETTLED';

export interface Claim {
  claimId: number;
  claimNumber: string;
  policyId: number;
  policyNumber: string;
  policyType: string;
  claimAmount: number;
  approvedAmount: number | null;
  incidentDate: string;
  reason: string;
  status: ClaimStatus;
  submittedDate: string;
}

export interface ClaimLimit {
  policyId: number;
  policyNumber: string;
  sumInsured: number;
  claimedAmount: number;
  remainingLimit: number;
  startDate: string;
  endDate: string;
}

export interface CreateClaimRequest {
  policyId: number;
  claimAmount: number;
  incidentDate: string;
  reason: string;
}
export type AllocationType = 'SUM_INSURED' | 'PREMIUM' | 'CLAIM';

export interface ProportionalSetup {
  retentionPercentage: number;
  quotaSharePercentage: number;
  surplusPercentage: number;
}

export interface ProportionalAllocation {
  id: number;
  policyNumber: string;
  claimNumber: string | null;
  allocationType: AllocationType;
  totalAmount: number;
  retentionAmount: number;
  quotaShareAmount: number;
  surplusAmount: number;
}

export interface ProportionalTreaty {
  setup: ProportionalSetup;
  allocations: ProportionalAllocation[];
}

export interface NonProportionalSetup {
  priorityFrom: number;
  priorityTo: number;
  layer1From: number;
  layer1To: number;
  layer2From: number;
  layer2To: number;
  layer3From: number;
  layer3To: number;
}

export interface NonProportionalAllocation {
  id: number;
  policyNumber: string;
  claimNumber: string;
  retentionAmount: number;
  priority: number;
  layer1: number;
  layer2: number;
  layer3: number;
}

export interface NonProportionalTreaty {
  setup: NonProportionalSetup;
  allocations: NonProportionalAllocation[];
}
import { Chip } from '@mui/material';
import type { PolicyStatus } from '../types/policy';

const CONFIG: Record<PolicyStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  ACTIVE: { label: 'Active', color: 'success' },
  PENDING_APPROVAL: { label: 'Pending Approval', color: 'warning' },
  EXPIRED: { label: 'Expired', color: 'default' },
};

interface PolicyStatusChipProps {
  status: PolicyStatus;
  onClick?: () => void;
}

export default function PolicyStatusChip({ status, onClick }: PolicyStatusChipProps) {
  const { label, color } = CONFIG[status];
  return <Chip size="small" label={label} color={color} onClick={onClick} />;
}
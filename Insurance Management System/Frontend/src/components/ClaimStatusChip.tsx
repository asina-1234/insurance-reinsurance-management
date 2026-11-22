import { Chip } from '@mui/material';
import type { ClaimStatus } from '../types/claim';

const CONFIG: Record<ClaimStatus, { label: string; color: 'info' | 'success' | 'primary' }> = {
  SUBMITTED: { label: 'Submitted', color: 'info' },
  APPROVED: { label: 'Approved', color: 'success' },
  SETTLED: { label: 'Settled', color: 'primary' },
};

interface ClaimStatusChipProps {
  status: ClaimStatus;
  onClick?: () => void;
}

export default function ClaimStatusChip({ status, onClick }: ClaimStatusChipProps) {
  const { label, color } = CONFIG[status];
  return <Chip size="small" label={label} color={color} onClick={onClick} />;
}
import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { adminApi } from '../../api/adminApi';
import AdminClaimsTable from '../../components/AdminClaimsTable';
import ChangeStatusDialog, { type StatusOption } from '../../components/ChangeStatusDialog';
import { colors } from '../../theme/theme';
import type { AdminClaim } from '../../types/admin';
import type { ClaimStatus } from '../../types/claim';
import { getErrorMessage } from '../../utils/errors';

/** A claim can only move one step forward: Submitted -> Approved -> Settled. */
const NEXT_STATUS: Record<ClaimStatus, ClaimStatus | null> = {
  SUBMITTED: 'APPROVED',
  APPROVED: 'SETTLED',
  SETTLED: null,
};

const ALL_OPTIONS: Omit<StatusOption, 'disabled'>[] = [
  { value: 'SUBMITTED', label: 'Submitted', color: 'info' },
  { value: 'APPROVED', label: 'Approved', color: 'success' },
  { value: 'SETTLED', label: 'Settled', color: 'primary' },
];

function optionsFor(current: ClaimStatus): StatusOption[] {
  return ALL_OPTIONS.map((o) => ({
    ...o,
    disabled: o.value !== current && o.value !== NEXT_STATUS[current],
  }));
}

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState<AdminClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusTarget, setStatusTarget] = useState<AdminClaim | null>(null);

  useEffect(() => {
    let active = true;
    adminApi
      .getClaims()
      .then((res) => {
        if (active) setClaims(res.data.data);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleConfirm = async (value: string) => {
    if (!statusTarget) {
      return;
    }
    const res = await adminApi.updateClaimStatus(statusTarget.claimId, value as ClaimStatus);
    const updated = res.data.data;
    setClaims((prev) => prev.map((c) => (c.claimId === updated.claimId ? updated : c)));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography sx={{ color: 'error.main' }}>{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: colors.brownDark, mb: 2 }}>
        Claims
      </Typography>

      <AdminClaimsTable
        rows={claims}
        height={520}
        emptyText="No claims have been raised yet."
        onStatusClick={setStatusTarget}
      />

      {statusTarget && (
        <ChangeStatusDialog
          key={statusTarget.claimId}
          subtitle={`Claim ${statusTarget.claimNumber} - Policy ${statusTarget.policyNumber}`}
          current={statusTarget.status}
          options={optionsFor(statusTarget.status)}
          onClose={() => setStatusTarget(null)}
          onConfirm={handleConfirm}
        />
      )}
    </Box>
  );
}
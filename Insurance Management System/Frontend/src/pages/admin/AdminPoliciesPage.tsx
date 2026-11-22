import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { adminApi } from '../../api/adminApi';
import AdminPoliciesTable from '../../components/AdminPoliciesTable';
import ChangeStatusDialog, { type StatusOption } from '../../components/ChangeStatusDialog';
import RelatedRecordsDialog, { type ViewTarget } from '../../components/RelatedRecordsDialog';
import { colors } from '../../theme/theme';
import type { AdminPolicy } from '../../types/admin';
import type { PolicyStatus } from '../../types/policy';
import { getErrorMessage } from '../../utils/errors';

const STATUS_OPTIONS: StatusOption[] = [
  { value: 'PENDING_APPROVAL', label: 'Pending Approval', color: 'warning' },
  { value: 'ACTIVE', label: 'Active', color: 'success' },
];

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<AdminPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusTarget, setStatusTarget] = useState<AdminPolicy | null>(null);
  const [viewTarget, setViewTarget] = useState<ViewTarget | null>(null);

  useEffect(() => {
    let active = true;
    adminApi
      .getPolicies()
      .then((res) => {
        if (active) setPolicies(res.data.data);
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
    const res = await adminApi.updatePolicyStatus(statusTarget.policyId, value as PolicyStatus);
    const updated = res.data.data;
    setPolicies((prev) => prev.map((p) => (p.policyId === updated.policyId ? updated : p)));
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
        Policies
      </Typography>

      <AdminPoliciesTable
        rows={policies}
        height={520}
        emptyText="No policies have been created yet."
        onStatusClick={setStatusTarget}
        onViewClaims={(p) =>
          setViewTarget({
            kind: 'policy-claims',
            id: p.policyId,
            title: `Claims of policy ${p.policyNumber}`,
          })
        }
      />

      {statusTarget && (
        <ChangeStatusDialog
          key={statusTarget.policyId}
          subtitle={`Policy ${statusTarget.policyNumber} - ${statusTarget.customerName}`}
          current={statusTarget.status}
          options={STATUS_OPTIONS}
          onClose={() => setStatusTarget(null)}
          onConfirm={handleConfirm}
        />
      )}

      <RelatedRecordsDialog target={viewTarget} onClose={() => setViewTarget(null)} />
    </Box>
  );
}
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { adminApi } from '../api/adminApi';
import { colors } from '../theme/theme';
import type { AdminClaim, AdminPolicy } from '../types/admin';
import { getErrorMessage } from '../utils/errors';
import AdminClaimsTable from './AdminClaimsTable';
import AdminPoliciesTable from './AdminPoliciesTable';

export interface ViewTarget {
  kind: 'customer-policies' | 'customer-claims' | 'policy-claims';
  id: number;
  title: string;
}

interface RelatedRecordsDialogProps {
  target: ViewTarget | null;
  onClose: () => void;
}

/** Mounts the content only while a target is selected, so it always loads fresh data. */
export default function RelatedRecordsDialog({ target, onClose }: RelatedRecordsDialogProps) {
  if (!target) {
    return null;
  }
  return <DialogContentLoader key={`${target.kind}-${target.id}`} target={target} onClose={onClose} />;
}

function DialogContentLoader({ target, onClose }: { target: ViewTarget; onClose: () => void }) {
  const [policies, setPolicies] = useState<AdminPolicy[]>([]);
  const [claims, setClaims] = useState<AdminClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        if (target.kind === 'customer-policies') {
          const res = await adminApi.getCustomerPolicies(target.id);
          if (active) setPolicies(res.data.data);
        } else if (target.kind === 'customer-claims') {
          const res = await adminApi.getCustomerClaims(target.id);
          if (active) setClaims(res.data.data);
        } else {
          const res = await adminApi.getPolicyClaims(target.id);
          if (active) setClaims(res.data.data);
        }
      } catch (err) {
        if (active) setError(getErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [target.kind, target.id]);

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth={false}
      sx={{ '& .MuiDialog-paper': { width: 1000, maxWidth: '95vw', height: 520 } }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: colors.brownDark }}>{target.title}</DialogTitle>

      <DialogContent dividers sx={{ p: 2 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}
        {!loading && error && <Typography sx={{ color: 'error.main' }}>{error}</Typography>}
        {!loading && !error && target.kind === 'customer-policies' && (
          <AdminPoliciesTable
            rows={policies}
            height={360}
            emptyText="This customer has no policies."
          />
        )}
        {!loading && !error && target.kind !== 'customer-policies' && (
          <AdminClaimsTable rows={claims} height={360} emptyText="No claims found." />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button variant="contained" size="small" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
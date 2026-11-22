import { useEffect, useState, type ChangeEvent } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { claimApi } from '../api/claimApi';
import { colors } from '../theme/theme';
import type { ClaimLimit } from '../types/claim';
import type { Policy } from '../types/policy';
import { minIso, todayIso } from '../utils/date';
import { getErrorMessage } from '../utils/errors';
import { formatCurrency, formatDate } from '../utils/format';
import MessageDialog from './MessageDialog';

interface RaiseClaimDialogProps {
  policy: Policy | null;
  onClose: () => void;
  onSuccess: () => void;
}

/** Mounts the form only while a policy is selected, so its state starts fresh every time. */
export default function RaiseClaimDialog({ policy, onClose, onSuccess }: RaiseClaimDialogProps) {
  if (!policy) {
    return null;
  }
  return (
    <RaiseClaimForm
      key={policy.policyId}
      policy={policy}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

interface RaiseClaimFormProps {
  policy: Policy;
  onClose: () => void;
  onSuccess: () => void;
}

function InfoItem({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: colors.tan, fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: bold ? 700 : 500, fontSize: 14 }}>{value}</Typography>
    </Box>
  );
}

function RaiseClaimForm({ policy, onClose, onSuccess }: RaiseClaimFormProps) {
  const [limit, setLimit] = useState<ClaimLimit | null>(null);
  const [loadingLimit, setLoadingLimit] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [amount, setAmount] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [reason, setReason] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    claimApi
      .getLimit(policy.policyId)
      .then((res) => {
        if (active) setLimit(res.data.data);
      })
      .catch((err) => {
        if (active) setLoadError(getErrorMessage(err));
      })
      .finally(() => {
        if (active) setLoadingLimit(false);
      });
    return () => {
      active = false;
    };
  }, [policy.policyId]);

  // ---- derived validation (frontend rules; the backend checks the same rules) ----
  const amountNumber = Number(amount);
  const maxDate = minIso(policy.endDate, todayIso());
  const noLimitLeft = limit !== null && limit.remainingLimit <= 0;
  const amountExceeds = limit !== null && amountNumber > limit.remainingLimit;
  const dateInvalid =
    incidentDate !== '' && (incidentDate < policy.startDate || incidentDate > maxDate);

  const canSubmit =
    limit !== null &&
    !noLimitLeft &&
    amountNumber > 0 &&
    !amountExceeds &&
    incidentDate !== '' &&
    !dateInvalid &&
    reason.trim() !== '' &&
    !submitting;

  const limitMessage = limit
    ? `Claim amount is greater than sum insured limit. Remaining limit: ${formatCurrency(limit.remainingLimit)}`
    : '';

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAmount(e.target.value.replace(/\D/g, '').slice(0, 12));
  };

  const handleAmountBlur = () => {
    if (amountExceeds) {
      setLimitDialogOpen(true);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }
    setSubmitting(true);
    try {
      const res = await claimApi.create({
        policyId: policy.policyId,
        claimAmount: amountNumber,
        incidentDate,
        reason: reason.trim(),
      });
      setSuccessMessage(`Claim ${res.data.data.claimNumber} submitted successfully.`);
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        open
        onClose={submitting ? undefined : onClose}
        maxWidth={false}
        sx={{ '& .MuiDialog-paper': { width: 540 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: colors.brownDark }}>
          Raise Claim - {policy.policyNumber}
        </DialogTitle>

        <DialogContent dividers sx={{ maxHeight: 470 }}>
          {loadingLimit && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {!loadingLimit && loadError && (
            <Typography sx={{ color: 'error.main' }}>{loadError}</Typography>
          )}

          {limit && (
            <>
              <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: colors.contentBg }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
                  <InfoItem label="Policy Type" value={policy.policyType} />
                  <InfoItem
                    label="Policy Period"
                    value={`${formatDate(limit.startDate)} to ${formatDate(limit.endDate)}`}
                  />
                  <InfoItem label="Sum Insured" value={formatCurrency(limit.sumInsured)} />
                  <InfoItem label="Already Claimed" value={formatCurrency(limit.claimedAmount)} />
                </Box>
                <Box sx={{ mt: 1.5 }}>
                  <InfoItem
                    label="Remaining Limit"
                    value={formatCurrency(limit.remainingLimit)}
                    bold
                  />
                </Box>
              </Paper>

              {noLimitLeft && (
                <Typography sx={{ color: 'error.main', mb: 2, fontWeight: 600 }}>
                  No claim limit is left on this policy.
                </Typography>
              )}

              <TextField
                fullWidth
                size="small"
                label="Claim Amount (₹)"
                value={amount}
                onChange={handleAmountChange}
                onBlur={handleAmountBlur}
                disabled={noLimitLeft}
                error={amountExceeds}
                helperText={amountExceeds ? 'Claim amount is greater than the remaining limit' : ' '}
                slotProps={{ htmlInput: { inputMode: 'numeric' } }}
              />

              <TextField
                fullWidth
                size="small"
                type="date"
                label="Incident Date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                disabled={noLimitLeft}
                error={dateInvalid}
                helperText={
                  dateInvalid
                    ? `Date must be between ${formatDate(policy.startDate)} and ${formatDate(maxDate)}`
                    : ' '
                }
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { min: policy.startDate, max: maxDate },
                }}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                label="Reason for Claim"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={noLimitLeft}
                helperText={`${reason.length}/500`}
                slotProps={{ htmlInput: { maxLength: 500 } }}
              />
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={submitting} color="secondary">
            Cancel
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="contained" onClick={handleSubmit} disabled={!canSubmit}>
            {submitting ? <CircularProgress size={22} color="inherit" /> : 'Raise Claim'}
          </Button>
        </DialogActions>
      </Dialog>

      <MessageDialog
        open={limitDialogOpen}
        title="Claim limit exceeded"
        message={limitMessage}
        onClose={() => setLimitDialogOpen(false)}
      />
      <MessageDialog
        open={errorMessage !== null}
        title="Could not raise claim"
        message={errorMessage ?? ''}
        onClose={() => setErrorMessage(null)}
      />
      <MessageDialog
        open={successMessage !== null}
        variant="success"
        title="Claim submitted"
        message={successMessage ?? ''}
        onClose={onSuccess}
      />
    </>
  );
}
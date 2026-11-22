import { useMemo, useState, type ChangeEvent } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { policyApi } from '../api/policyApi';
import { colors } from '../theme/theme';
import type { Policy, PolicyTypeOption } from '../types/policy';
import { getErrorMessage } from '../utils/errors';
import { formatCurrency } from '../utils/format';
import { calculatePremium } from '../utils/premium';
import MessageDialog from './MessageDialog';

interface CreatePolicyDialogProps {
  catalog: PolicyTypeOption[];
  onClose: () => void;
  onCreated: (policy: Policy) => void;
}

interface FormErrors {
  type?: string;
  sumInsured?: string;
}

export default function CreatePolicyDialog({
  catalog,
  onClose,
  onCreated,
}: CreatePolicyDialogProps) {
  const [typeCode, setTypeCode] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [sumInsured, setSumInsured] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedType = catalog.find((t) => t.code === typeCode);

  const breakdown = useMemo(() => {
    if (!selectedType || !sumInsured || Number(sumInsured) <= 0) {
      return null;
    }
    const percents = selectedType.addOns
      .filter((a) => selected.includes(a.name))
      .map((a) => a.percentage);
    return calculatePremium(selectedType.baseRatePercent, percents, Number(sumInsured));
  }, [selectedType, selected, sumInsured]);

  const handleTypeChange = (value: string) => {
    setTypeCode(value);
    setSelected([]);
    setErrors((prev) => ({ ...prev, type: undefined }));
  };

  const handleSumChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSumInsured(e.target.value.replace(/\D/g, '').slice(0, 12));
    setErrors((prev) => ({ ...prev, sumInsured: undefined }));
  };

  const toggleAddOn = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleSubmit = async () => {
    const found: FormErrors = {};
    if (!typeCode) {
      found.type = 'Select a policy type';
    }
    if (!sumInsured || Number(sumInsured) <= 0) {
      found.sumInsured = 'Enter a valid sum insured';
    }
    setErrors(found);
    if (Object.keys(found).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await policyApi.create({
        policyType: typeCode,
        addons: selected,
        sumInsured: Number(sumInsured),
      });
      onCreated(res.data.data);
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
        sx={{ '& .MuiDialog-paper': { width: 560 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: colors.brownDark }}>
          Create New Policy
        </DialogTitle>

        <DialogContent dividers sx={{ maxHeight: 460 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Policy Type"
            value={typeCode}
            onChange={(e) => handleTypeChange(e.target.value)}
            error={Boolean(errors.type)}
            helperText={errors.type || ' '}
          >
            {catalog.map((t) => (
              <MenuItem key={t.code} value={t.code}>
                {t.label}
              </MenuItem>
            ))}
          </TextField>

          <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 0.5 }}>Add-ons</Typography>
          {selectedType ? (
            <FormGroup sx={{ mb: 1 }}>
              {selectedType.addOns.map((a) => (
                <FormControlLabel
                  key={a.name}
                  control={
                    <Checkbox
                      size="small"
                      checked={selected.includes(a.name)}
                      onChange={() => toggleAddOn(a.name)}
                    />
                  }
                  label={`${a.name} (+${a.percentage}%)`}
                />
              ))}
            </FormGroup>
          ) : (
            <Typography variant="body2" sx={{ mb: 2, color: colors.tan }}>
              Select a policy type to see its add-ons.
            </Typography>
          )}

          <TextField
            fullWidth
            size="small"
            label="Sum Insured (₹)"
            value={sumInsured}
            onChange={handleSumChange}
            error={Boolean(errors.sumInsured)}
            helperText={errors.sumInsured || ' '}
            slotProps={{ htmlInput: { inputMode: 'numeric' } }}
          />

          <Paper variant="outlined" sx={{ p: 2, bgcolor: colors.contentBg }}>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Premium</Typography>
            {breakdown ? (
              <>
                <Typography variant="body2">
                  Base rate: {breakdown.baseRatePercent}% | Add-ons: +{breakdown.addOnPercent}%
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.brownDark }}>
                  {formatCurrency(breakdown.premium)}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" sx={{ color: colors.tan }}>
                Choose a policy type and enter the sum insured to see the premium.
              </Typography>
            )}
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: colors.tan }}>
              The policy runs for 1 year from today.
            </Typography>
          </Paper>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={submitting} color="secondary">
            Cancel
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <CircularProgress size={22} color="inherit" /> : 'Create Policy'}
          </Button>
        </DialogActions>
      </Dialog>

      <MessageDialog
        open={errorMessage !== null}
        title="Could not create policy"
        message={errorMessage ?? ''}
        onClose={() => setErrorMessage(null)}
      />
    </>
  );
}
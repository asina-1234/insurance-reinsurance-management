import { useState } from 'react';
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
import { colors } from '../theme/theme';
import { getErrorMessage } from '../utils/errors';

export interface StatusOption {
  value: string;
  label: string;
  color: 'warning' | 'success' | 'info' | 'primary';
  disabled?: boolean;
}

interface ChangeStatusDialogProps {
  subtitle: string;
  current: string;
  options: StatusOption[];
  onClose: () => void;
  onConfirm: (value: string) => Promise<void>;
}

/** Selected status = filled button, the others = outlined. OK becomes filled once a new status is chosen. */
export default function ChangeStatusDialog({
  subtitle,
  current,
  options,
  onClose,
  onConfirm,
}: ChangeStatusDialogProps) {
  const [selected, setSelected] = useState(current);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changed = selected !== current;

  const handleOk = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(selected);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={submitting ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: colors.brownDark }}>Change Status</DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, color: colors.tan }}>
          {subtitle}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
          {options.map((o) => (
            <Button
              key={o.value}
              color={o.color}
              variant={selected === o.value ? 'contained' : 'outlined'}
              disabled={o.disabled || submitting}
              onClick={() => setSelected(o.value)}
            >
              {o.label}
            </Button>
          ))}
        </Box>

        {error && (
          <Typography variant="body2" sx={{ color: 'error.main', mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          size="small"
          variant={changed ? 'contained' : 'outlined'}
          disabled={!changed || submitting}
          onClick={handleOk}
        >
          {submitting ? <CircularProgress size={18} color="inherit" /> : 'OK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
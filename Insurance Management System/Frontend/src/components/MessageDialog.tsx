import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

interface MessageDialogProps {
  open: boolean;
  title: string;
  message: string;
  variant?: 'error' | 'success';
  onClose: () => void;
}

export default function MessageDialog({
  open,
  title,
  message,
  variant = 'error',
  onClose,
}: MessageDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          color: variant === 'error' ? 'error.main' : 'success.main',
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ textAlign: 'center' }}>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button variant="contained" onClick={onClose}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
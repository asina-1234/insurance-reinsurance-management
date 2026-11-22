import type { ChangeEvent } from 'react';
import { Box, TextField, Typography } from '@mui/material';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  type?: string;
}

export default function FormField({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
}: FormFieldProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        component="label"
        htmlFor={name}
        sx={{ display: 'block', fontSize: 14, fontWeight: 600, mb: 0.5 }}
      >
        {label}
      </Typography>
      <TextField
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        size="small"
        fullWidth
        error={Boolean(error)}
        helperText={error || ' '}
        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#FFFFFF' } }}
      />
    </Box>
  );
}
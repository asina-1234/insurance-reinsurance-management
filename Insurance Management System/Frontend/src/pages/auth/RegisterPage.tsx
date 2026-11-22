import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Link, Paper, Typography } from '@mui/material';
import FormField from '../../components/FormField';
import MessageDialog from '../../components/MessageDialog';
import { authApi } from '../../api/authApi';
import { colors } from '../../theme/theme';
import { getErrorMessage } from '../../utils/errors';
import { isValidEmail, isValidPhone } from '../../utils/validators';

interface FormState {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}
type FormErrors = Partial<FormState>;

const FIELDS: { name: keyof FormState; label: string; type?: string }[] = [
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'phone', label: 'Phone Number' },
  { name: 'address', label: 'Address' },
];

const EMPTY_FORM: FormState = { name: '', email: '', password: '', phone: '', address: '' };

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): FormErrors => {
    const found: FormErrors = {};
    if (!form.name.trim()) {
      found.name = 'Name is required';
    }
    if (!form.email.trim()) {
      found.email = 'Email is required';
    } else if (!isValidEmail(form.email)) {
      found.email = 'Enter a valid email';
    }
    if (!form.password) {
      found.password = 'Password is required';
    }
    if (!form.phone) {
      found.phone = 'Phone number is required';
    } else if (!isValidPhone(form.phone)) {
      found.phone = 'Phone must be exactly 10 digits';
    }
    if (!form.address.trim()) {
      found.address = 'Address is required';
    }
    return found;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone,
        address: form.address.trim(),
      });
      setSuccess(true);
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper
        elevation={3}
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          width: 460,
          height: 665,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: colors.brownDark, textAlign: 'center', mb: 2 }}
        >
          Fill the details to create the account
        </Typography>

        {FIELDS.map((f) => (
          <FormField
            key={f.name}
            label={f.label}
            name={f.name}
            type={f.type}
            value={form[f.name]}
            onChange={handleChange}
            error={errors[f.name]}
          />
        ))}

        <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 0.5 }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
        </Button>

        <Typography sx={{ textAlign: 'center', mt: 1.5 }}>
          Already have an account?{' '}
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            sx={{ color: colors.link, fontWeight: 600 }}
          >
            Login
          </Link>
        </Typography>
      </Paper>

      <MessageDialog
        open={errorMessage !== null}
        title="Registration failed"
        message={errorMessage ?? ''}
        onClose={() => setErrorMessage(null)}
      />
      <MessageDialog
        open={success}
        variant="success"
        title="Account created"
        message="Your account has been created. Please login."
        onClose={() => navigate('/login', { replace: true })}
      />
    </Box>
  );
}
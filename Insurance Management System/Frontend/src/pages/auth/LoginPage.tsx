import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Link, Paper, Typography } from '@mui/material';
import FormField from '../../components/FormField';
import MessageDialog from '../../components/MessageDialog';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import { homePath } from '../../routes/paths';
import { colors } from '../../theme/theme';
import { getErrorMessage } from '../../utils/errors';
import { isValidEmail } from '../../utils/validators';

interface FormState {
  email: string;
  password: string;
}
type FormErrors = Partial<FormState>;

export default function LoginPage() {
  const { user, login } = useAuth();
  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);

  if (user) {
    return <Navigate to={homePath(user.role)} replace />;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): FormErrors => {
    const found: FormErrors = {};
    if (!form.email.trim()) {
      found.email = 'Email is required';
    } else if (!isValidEmail(form.email)) {
      found.email = 'Enter a valid email';
    }
    if (!form.password) {
      found.password = 'Password is required';
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
      const res = await authApi.login({
        email: form.email.trim(),
        password: form.password,
      });
      login(res.data.data);
    } catch (err) {
      setDialogMessage(getErrorMessage(err));
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
          width: 420,
          height: 470,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: colors.brownDark, textAlign: 'center' }}
        >
          Insurance Management System
        </Typography>
        <Typography sx={{ textAlign: 'center', mt: 0.5, mb: 3 }}>
          Login to your account
        </Typography>

        <FormField
          label="Username (Email)"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 1 }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>

        <Typography sx={{ textAlign: 'center', mt: 2 }}>
          New user?{' '}
          <Link
            component={RouterLink}
            to="/register"
            underline="hover"
            sx={{ color: colors.link, fontWeight: 600 }}
          >
            Register now
          </Link>
        </Typography>
      </Paper>

      <MessageDialog
        open={dialogMessage !== null}
        title="Login failed"
        message={dialogMessage ?? ''}
        onClose={() => setDialogMessage(null)}
      />
    </Box>
  );
}
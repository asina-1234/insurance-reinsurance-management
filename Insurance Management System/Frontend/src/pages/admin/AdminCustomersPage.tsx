import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { adminApi } from '../../api/adminApi';
import RelatedRecordsDialog, { type ViewTarget } from '../../components/RelatedRecordsDialog';
import { colors } from '../../theme/theme';
import { ellipsisSx, tableSx } from '../../theme/tableStyles';
import type { AdminCustomer } from '../../types/admin';
import { getErrorMessage } from '../../utils/errors';
import { formatDate } from '../../utils/format';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [target, setTarget] = useState<ViewTarget | null>(null);

  useEffect(() => {
    let active = true;
    adminApi
      .getCustomers()
      .then((res) => {
        if (active) setCustomers(res.data.data);
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

  const viewPolicies = (c: AdminCustomer) =>
    setTarget({
      kind: 'customer-policies',
      id: c.customerId,
      title: `Policies of ${c.name} (Customer ID ${c.customerId})`,
    });

  const viewClaims = (c: AdminCustomer) =>
    setTarget({
      kind: 'customer-claims',
      id: c.customerId,
      title: `Claims of ${c.name} (Customer ID ${c.customerId})`,
    });

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: colors.brownDark, mb: 2 }}>
        Customers
      </Typography>

      <Paper>
        <TableContainer sx={{ height: 520 }}>
          <Table stickyHeader size="small" sx={tableSx(1000)}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 70 }}>Customer ID</TableCell>
                <TableCell sx={{ width: 120 }}>Name</TableCell>
                <TableCell sx={{ width: 170 }}>Email</TableCell>
                <TableCell sx={{ width: 100 }}>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell sx={{ width: 90 }}>Registered On</TableCell>
                <TableCell sx={{ width: 70 }}>Policies Count</TableCell>
                <TableCell sx={{ width: 70 }}>Claims Count</TableCell>
                <TableCell sx={{ width: 80 }} align="center">
                  View Policy
                </TableCell>
                <TableCell sx={{ width: 80 }} align="center">
                  View Claim
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                    No customers have registered yet.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((c) => (
                  <TableRow key={c.customerId} hover>
                    <TableCell>{c.customerId}</TableCell>
                    <TableCell sx={ellipsisSx}>{c.name}</TableCell>
                    <TableCell sx={ellipsisSx}>
                      <Tooltip title={c.email}>
                        <span>{c.email}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{c.phone ?? '-'}</TableCell>
                    <TableCell sx={ellipsisSx}>
                      <Tooltip title={c.address ?? ''}>
                        <span>{c.address || '-'}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{formatDate(c.registrationDate.split('T')[0])}</TableCell>
                    <TableCell>{c.policiesCount}</TableCell>
                    <TableCell>{c.claimsCount}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        aria-label="View policies"
                        sx={{ color: colors.brown }}
                        onClick={() => viewPolicies(c)}
                      >
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        aria-label="View claims"
                        sx={{ color: colors.brown }}
                        onClick={() => viewClaims(c)}
                      >
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <RelatedRecordsDialog target={target} onClose={() => setTarget(null)} />
    </Box>
  );
}
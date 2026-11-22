import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { adminApi } from '../../api/adminApi';
import { colors } from '../../theme/theme';
import { tableSx } from '../../theme/tableStyles';
import type { AllocationType, ProportionalTreaty } from '../../types/treaty';
import { getErrorMessage } from '../../utils/errors';
import { formatCurrency } from '../../utils/format';

const TYPE_LABEL: Record<AllocationType, string> = {
  SUM_INSURED: 'Sum Insured',
  PREMIUM: 'Premium',
  CLAIM: 'Claim',
};

export default function ProportionalTreatyPage() {
  const [treaty, setTreaty] = useState<ProportionalTreaty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    adminApi
      .getProportionalTreaty()
      .then((res) => {
        if (active) setTreaty(res.data.data);
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

  if (error || !treaty) {
    return <Typography sx={{ color: 'error.main' }}>{error ?? 'Unable to load treaty'}</Typography>;
  }

  const { setup, allocations } = treaty;
  const total = setup.retentionPercentage + setup.quotaSharePercentage + setup.surplusPercentage;

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: colors.brownDark, mb: 2 }}>
        Proportional Treaty
      </Typography>

      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.brownDark, mb: 1 }}>
        Treaty Setup
      </Typography>
      <Paper sx={{ mb: 3 }}>
        <TableContainer>
          <Table size="small" sx={tableSx(600)}>
            <TableHead>
              <TableRow>
                <TableCell>Retention</TableCell>
                <TableCell>Quota Share</TableCell>
                <TableCell>Surplus</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{setup.retentionPercentage}%</TableCell>
                <TableCell>{setup.quotaSharePercentage}%</TableCell>
                <TableCell>{setup.surplusPercentage}%</TableCell>
                <TableCell>{total}%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.brownDark, mb: 1 }}>
        Allocations
      </Typography>
      <Paper>
        <TableContainer sx={{ height: 300 }}>
          <Table stickyHeader size="small" sx={tableSx(700)}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 80 }}>Policy No</TableCell>
                <TableCell sx={{ width: 80 }}>Claim No</TableCell>
                <TableCell sx={{ width: 100 }}>Type</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Retention</TableCell>
                <TableCell>Quota Share</TableCell>
                <TableCell>Surplus</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allocations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    No allocations yet. They are created when a policy or claim is approved.
                  </TableCell>
                </TableRow>
              ) : (
                allocations.map((a) => (
                  <TableRow key={a.id} hover>
                    <TableCell>{a.policyNumber}</TableCell>
                    <TableCell>{a.claimNumber ?? '-'}</TableCell>
                    <TableCell>{TYPE_LABEL[a.allocationType]}</TableCell>
                    <TableCell>{formatCurrency(a.totalAmount)}</TableCell>
                    <TableCell>{formatCurrency(a.retentionAmount)}</TableCell>
                    <TableCell>{formatCurrency(a.quotaShareAmount)}</TableCell>
                    <TableCell>{formatCurrency(a.surplusAmount)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
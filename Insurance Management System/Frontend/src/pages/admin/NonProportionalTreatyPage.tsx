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
import type { NonProportionalTreaty } from '../../types/treaty';
import { getErrorMessage } from '../../utils/errors';
import { formatCurrency } from '../../utils/format';

export default function NonProportionalTreatyPage() {
  const [treaty, setTreaty] = useState<NonProportionalTreaty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    adminApi
      .getNonProportionalTreaty()
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
  const ranges = [
    { name: 'Priority', from: setup.priorityFrom, to: setup.priorityTo },
    { name: 'Layer 1', from: setup.layer1From, to: setup.layer1To },
    { name: 'Layer 2', from: setup.layer2From, to: setup.layer2To },
    { name: 'Layer 3', from: setup.layer3From, to: setup.layer3To },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: colors.brownDark, mb: 2 }}>
        Non-Proportional Treaty
      </Typography>

      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.brownDark, mb: 1 }}>
        Treaty Setup
      </Typography>
      <Paper sx={{ mb: 3 }}>
        <TableContainer>
          <Table size="small" sx={tableSx(600)}>
            <TableHead>
              <TableRow>
                <TableCell>Component</TableCell>
                <TableCell>From Amount</TableCell>
                <TableCell>To Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ranges.map((r) => (
                <TableRow key={r.name}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{formatCurrency(r.from)}</TableCell>
                  <TableCell>{formatCurrency(r.to)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.brownDark, mb: 1 }}>
        Allocations
      </Typography>
      <Paper>
        <TableContainer sx={{ height: 250 }}>
          <Table stickyHeader size="small" sx={tableSx(700)}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 80 }}>Policy No</TableCell>
                <TableCell sx={{ width: 80 }}>Claim No</TableCell>
                <TableCell>Retention Amount</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Layer 1</TableCell>
                <TableCell>Layer 2</TableCell>
                <TableCell>Layer 3</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allocations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    No allocations yet. A row is created when a claim&apos;s retention is above the
                    priority limit.
                  </TableCell>
                </TableRow>
              ) : (
                allocations.map((a) => (
                  <TableRow key={a.id} hover>
                    <TableCell>{a.policyNumber}</TableCell>
                    <TableCell>{a.claimNumber}</TableCell>
                    <TableCell>{formatCurrency(a.retentionAmount)}</TableCell>
                    <TableCell>{formatCurrency(a.priority)}</TableCell>
                    <TableCell>{formatCurrency(a.layer1)}</TableCell>
                    <TableCell>{formatCurrency(a.layer2)}</TableCell>
                    <TableCell>{formatCurrency(a.layer3)}</TableCell>
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
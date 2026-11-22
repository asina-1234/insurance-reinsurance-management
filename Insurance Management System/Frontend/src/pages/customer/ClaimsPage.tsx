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
  Tooltip,
  Typography,
} from '@mui/material';
import { claimApi } from '../../api/claimApi';
import ClaimStatusChip from '../../components/ClaimStatusChip';
import { colors } from '../../theme/theme';
import type { Claim } from '../../types/claim';
import { getErrorMessage } from '../../utils/errors';
import { formatCurrency, formatDate } from '../../utils/format';

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    claimApi
      .getMyClaims()
      .then((res) => {
        if (active) setClaims(res.data.data);
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

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: colors.brownDark, mb: 2 }}>
        My Claims
      </Typography>

      <Paper>
        <TableContainer sx={{ height: 500 }}>
          <Table
            stickyHeader
            size="small"
            sx={{
              tableLayout: 'fixed',
              '& .MuiTableCell-head': { bgcolor: colors.tableHeader, fontWeight: 700 },
              '& .MuiTableCell-root': { fontSize: 12.5, px: 1 },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 72 }}>Claim No</TableCell>
                <TableCell sx={{ width: 72 }}>Policy No</TableCell>
                <TableCell sx={{ width: 72 }}>Type</TableCell>
                <TableCell sx={{ width: 105 }}>Claim Amount</TableCell>
                <TableCell sx={{ width: 105 }}>Approved</TableCell>
                <TableCell sx={{ width: 85 }}>Incident</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell sx={{ width: 105 }}>Status</TableCell>
                <TableCell sx={{ width: 85 }}>Submitted</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {claims.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    No claims yet. Raise a claim from the Policies page.
                  </TableCell>
                </TableRow>
              ) : (
                claims.map((c) => (
                  <TableRow key={c.claimId} hover>
                    <TableCell>{c.claimNumber}</TableCell>
                    <TableCell>{c.policyNumber}</TableCell>
                    <TableCell>{c.policyType}</TableCell>
                    <TableCell>{formatCurrency(c.claimAmount)}</TableCell>
                    <TableCell>
                      {c.approvedAmount === null ? '-' : formatCurrency(c.approvedAmount)}
                    </TableCell>
                    <TableCell>{formatDate(c.incidentDate)}</TableCell>
                    <TableCell
                      sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      <Tooltip title={c.reason}>
                        <span>{c.reason}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <ClaimStatusChip status={c.status} />
                    </TableCell>
                    <TableCell>{formatDate(c.submittedDate.split('T')[0])}</TableCell>
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
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
import { customerApi } from '../../api/customerApi';
import PolicyStatusChip from '../../components/PolicyStatusChip';
import { colors } from '../../theme/theme';
import type { Profile } from '../../types/customer';
import { getErrorMessage } from '../../utils/errors';
import { formatCurrency, formatDate } from '../../utils/format';

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: colors.tan, fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 600, wordBreak: 'break-word' }}>{value || '-'}</Typography>
    </Box>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    customerApi
      .getProfile()
      .then((res) => {
        if (active) setProfile(res.data.data);
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

  if (error || !profile) {
    return <Typography sx={{ color: 'error.main' }}>{error ?? 'Unable to load profile'}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: colors.brownDark, mb: 2 }}>
        My Profile
      </Typography>

      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <InfoItem label="Customer / Policy Holder Name" value={profile.name} />
          <InfoItem label="Email" value={profile.email} />
          <InfoItem label="Phone Number" value={profile.phone ?? ''} />
          <InfoItem label="Address" value={profile.address ?? ''} />
        </Box>
      </Paper>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.brownDark, mb: 1 }}>
        My Policies
      </Typography>

      <Paper>
        <TableContainer sx={{ height: 300 }}>
          <Table
            stickyHeader
            size="small"
            sx={{
              tableLayout: 'fixed',
              '& .MuiTableCell-head': { bgcolor: colors.tableHeader, fontWeight: 700 },
              '& .MuiTableCell-root': { fontSize: 13 },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 80 }}>Policy No</TableCell>
                <TableCell sx={{ width: 80 }}>Type</TableCell>
                <TableCell>Covers</TableCell>
                <TableCell sx={{ width: 110 }}>Sum Insured</TableCell>
                <TableCell sx={{ width: 90 }}>Premium</TableCell>
                <TableCell sx={{ width: 95 }}>Start Date</TableCell>
                <TableCell sx={{ width: 95 }}>End Date</TableCell>
                <TableCell sx={{ width: 115 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profile.policies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    No policies yet. Go to Policies to create one.
                  </TableCell>
                </TableRow>
              ) : (
                profile.policies.map((p) => (
                  <TableRow key={p.policyId} hover>
                    <TableCell>{p.policyNumber}</TableCell>
                    <TableCell>{p.policyType}</TableCell>
                    <TableCell
                      sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      <Tooltip title={p.addons ?? ''}>
                        <span>{p.addons || '-'}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{formatCurrency(p.sumInsured)}</TableCell>
                    <TableCell>{formatCurrency(p.premium)}</TableCell>
                    <TableCell>{formatDate(p.startDate)}</TableCell>
                    <TableCell>{formatDate(p.endDate)}</TableCell>
                    <TableCell>
                      <PolicyStatusChip status={p.status} />
                    </TableCell>
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
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
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
import AddIcon from '@mui/icons-material/Add';
import { policyApi } from '../../api/policyApi';
import CreatePolicyDialog from '../../components/CreatePolicyDialog';
import MessageDialog from '../../components/MessageDialog';
import PolicyStatusChip from '../../components/PolicyStatusChip';
import RaiseClaimDialog from '../../components/RaiseClaimDialog';
import { colors } from '../../theme/theme';
import type { Policy, PolicyTypeOption } from '../../types/policy';
import { getErrorMessage } from '../../utils/errors';
import { formatCurrency, formatDate } from '../../utils/format';

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [catalog, setCatalog] = useState<PolicyTypeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [claimPolicy, setClaimPolicy] = useState<Policy | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([policyApi.getMyPolicies(), policyApi.getCatalog()])
      .then(([policyRes, catalogRes]) => {
        if (active) {
          setPolicies(policyRes.data.data);
          setCatalog(catalogRes.data.data);
        }
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

  const handleCreated = (policy: Policy) => {
    setPolicies((prev) => [policy, ...prev]);
    setCreateOpen(false);
    setSuccessMessage(
      `Policy ${policy.policyNumber} created. It is now pending admin approval.`
    );
  };

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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: colors.brownDark }}>
          My Policies
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Create New Policy
        </Button>
      </Box>

      <Paper>
        <TableContainer sx={{ height: 470 }}>
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
                <TableCell sx={{ width: 70 }}>Policy No</TableCell>
                <TableCell sx={{ width: 70 }}>Type</TableCell>
                <TableCell>Covers</TableCell>
                <TableCell sx={{ width: 105 }}>Sum Insured</TableCell>
                <TableCell sx={{ width: 90 }}>Premium</TableCell>
                <TableCell sx={{ width: 82 }}>Start</TableCell>
                <TableCell sx={{ width: 82 }}>End</TableCell>
                <TableCell sx={{ width: 112 }}>Status</TableCell>
                <TableCell sx={{ width: 108 }} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {policies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    No policies yet. Click "Create New Policy" to add one.
                  </TableCell>
                </TableRow>
              ) : (
                policies.map((p) => (
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
                    <TableCell align="center">
                      <Tooltip
                        title={p.status === 'ACTIVE' ? '' : 'Claims can be raised on active policies only'}
                      >
                        <span>
                          <Button
                            size="small"
                            variant="outlined"
                            disabled={p.status !== 'ACTIVE'}
                            onClick={() => setClaimPolicy(p)}
                          >
                            Raise Claim
                          </Button>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {createOpen && (
        <CreatePolicyDialog
          catalog={catalog}
          onClose={() => setCreateOpen(false)}
          onCreated={handleCreated}
        />
      )}

      <RaiseClaimDialog
        policy={claimPolicy}
        onClose={() => setClaimPolicy(null)}
        onSuccess={() => setClaimPolicy(null)}
      />

      <MessageDialog
        open={successMessage !== null}
        variant="success"
        title="Policy created"
        message={successMessage ?? ''}
        onClose={() => setSuccessMessage(null)}
      />
    </Box>
  );
}
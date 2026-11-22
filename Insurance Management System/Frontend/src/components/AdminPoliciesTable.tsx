import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { colors } from '../theme/theme';
import { ellipsisSx, tableSx } from '../theme/tableStyles';
import type { AdminPolicy } from '../types/admin';
import { formatCurrency, formatDate } from '../utils/format';
import PolicyStatusChip from './PolicyStatusChip';

interface AdminPoliciesTableProps {
  rows: AdminPolicy[];
  height: number;
  emptyText?: string;
  /** When given, pending policies get a clickable status chip. */
  onStatusClick?: (policy: AdminPolicy) => void;
  /** When given, the "View Claims" column with the info icon is shown. */
  onViewClaims?: (policy: AdminPolicy) => void;
}

export default function AdminPoliciesTable({
  rows,
  height,
  emptyText = 'No policies found.',
  onStatusClick,
  onViewClaims,
}: AdminPoliciesTableProps) {
  const showView = Boolean(onViewClaims);
  const columnCount = showView ? 12 : 11;

  return (
    <Paper>
      <TableContainer sx={{ height }}>
        <Table stickyHeader size="small" sx={tableSx(showView ? 1105 : 1035)}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 72 }}>Policy No</TableCell>
              <TableCell sx={{ width: 72 }}>Customer ID</TableCell>
              <TableCell sx={{ width: 120 }}>Customer Name</TableCell>
              <TableCell sx={{ width: 72 }}>Type</TableCell>
              <TableCell>Covers</TableCell>
              <TableCell sx={{ width: 105 }}>Sum Insured</TableCell>
              <TableCell sx={{ width: 90 }}>Premium</TableCell>
              <TableCell sx={{ width: 82 }}>Start</TableCell>
              <TableCell sx={{ width: 82 }}>End</TableCell>
              <TableCell sx={{ width: 120 }}>Status</TableCell>
              <TableCell sx={{ width: 70 }}>No. of Claims</TableCell>
              {showView && (
                <TableCell sx={{ width: 70 }} align="center">
                  View Claims
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnCount} align="center" sx={{ py: 6 }}>
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((p) => (
                <TableRow key={p.policyId} hover>
                  <TableCell>{p.policyNumber}</TableCell>
                  <TableCell>{p.customerId}</TableCell>
                  <TableCell sx={ellipsisSx}>{p.customerName}</TableCell>
                  <TableCell>{p.policyType}</TableCell>
                  <TableCell sx={ellipsisSx}>
                    <Tooltip title={p.addons ?? ''}>
                      <span>{p.addons || '-'}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{formatCurrency(p.sumInsured)}</TableCell>
                  <TableCell>{formatCurrency(p.premium)}</TableCell>
                  <TableCell>{formatDate(p.startDate)}</TableCell>
                  <TableCell>{formatDate(p.endDate)}</TableCell>
                  <TableCell>
                    <PolicyStatusChip
                      status={p.status}
                      onClick={
                        onStatusClick && p.status === 'PENDING_APPROVAL'
                          ? () => onStatusClick(p)
                          : undefined
                      }
                    />
                  </TableCell>
                  <TableCell>{p.claimsCount}</TableCell>
                  {showView && onViewClaims && (
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        aria-label="View claims"
                        sx={{ color: colors.brown }}
                        onClick={() => onViewClaims(p)}
                      >
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
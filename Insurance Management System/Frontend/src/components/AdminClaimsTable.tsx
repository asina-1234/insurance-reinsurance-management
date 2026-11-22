import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { ellipsisSx, tableSx } from '../theme/tableStyles';
import type { AdminClaim } from '../types/admin';
import { formatCurrency, formatDate } from '../utils/format';
import ClaimStatusChip from './ClaimStatusChip';

interface AdminClaimsTableProps {
  rows: AdminClaim[];
  height: number;
  emptyText?: string;
  /** When given, claims that are not yet settled get a clickable status chip. */
  onStatusClick?: (claim: AdminClaim) => void;
}

export default function AdminClaimsTable({
  rows,
  height,
  emptyText = 'No claims found.',
  onStatusClick,
}: AdminClaimsTableProps) {
  return (
    <Paper>
      <TableContainer sx={{ height }}>
        <Table stickyHeader size="small" sx={tableSx(986)}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 72 }}>Claim No</TableCell>
              <TableCell sx={{ width: 72 }}>Policy No</TableCell>
              <TableCell sx={{ width: 72 }}>Customer ID</TableCell>
              <TableCell sx={{ width: 120 }}>Customer Name</TableCell>
              <TableCell sx={{ width: 105 }}>Claim Amount</TableCell>
              <TableCell sx={{ width: 105 }}>Approved Amount</TableCell>
              <TableCell sx={{ width: 85 }}>Incident Date</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell sx={{ width: 85 }}>Submitted</TableCell>
              <TableCell sx={{ width: 110 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((c) => (
                <TableRow key={c.claimId} hover>
                  <TableCell>{c.claimNumber}</TableCell>
                  <TableCell>{c.policyNumber}</TableCell>
                  <TableCell>{c.customerId}</TableCell>
                  <TableCell sx={ellipsisSx}>{c.customerName}</TableCell>
                  <TableCell>{formatCurrency(c.claimAmount)}</TableCell>
                  <TableCell>
                    {c.approvedAmount === null ? '-' : formatCurrency(c.approvedAmount)}
                  </TableCell>
                  <TableCell>{formatDate(c.incidentDate)}</TableCell>
                  <TableCell sx={ellipsisSx}>
                    <Tooltip title={c.reason}>
                      <span>{c.reason}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{formatDate(c.submittedDate.split('T')[0])}</TableCell>
                  <TableCell>
                    <ClaimStatusChip
                      status={c.status}
                      onClick={
                        onStatusClick && c.status !== 'SETTLED' ? () => onStatusClick(c) : undefined
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
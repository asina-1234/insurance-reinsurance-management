import { colors } from './theme';

/** Shared look for every fixed-width table. Wider content scrolls inside its container. */
export const tableSx = (minWidth: number) => ({
  tableLayout: 'fixed',
  minWidth,
  '& .MuiTableCell-head': { bgcolor: colors.tableHeader, fontWeight: 700 },
  '& .MuiTableCell-root': { fontSize: 12.5, px: 1 },
});

export const ellipsisSx = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const;
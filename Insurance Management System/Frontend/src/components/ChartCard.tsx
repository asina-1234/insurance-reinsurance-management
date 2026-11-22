import type { ReactNode } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { colors } from '../theme/theme';

export const CHART_HEIGHT = 250;

interface ChartCardProps {
  title: string;
  subtitle: string;
  empty?: boolean;
  emptyText?: string;
  children: ReactNode;
}

export default function ChartCard({
  title,
  subtitle,
  empty = false,
  emptyText = 'No data yet',
  children,
}: ChartCardProps) {
  return (
    <Paper sx={{ p: 2, height: 350, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <Typography sx={{ fontWeight: 700, color: colors.brownDark }}>{title}</Typography>
      <Typography variant="caption" sx={{ color: colors.tan, mb: 1 }}>
        {subtitle}
      </Typography>

      {empty ? (
        <Box
          sx={{
            height: CHART_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: colors.tan }}>
            {emptyText}
          </Typography>
        </Box>
      ) : (
        children
      )}
    </Paper>
  );
}
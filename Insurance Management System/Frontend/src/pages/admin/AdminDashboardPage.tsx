import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { dashboardApi } from '../../api/dashboardApi';
import ChartCard, { CHART_HEIGHT } from '../../components/ChartCard';
import { colors } from '../../theme/theme';
import type { AllocationType } from '../../types/treaty';
import type { Dashboard } from '../../types/dashboard';
import { formatCompact, formatTooltipAmount, formatWholeNumber } from '../../utils/chart';
import { getErrorMessage } from '../../utils/errors';

const ALLOCATION_LABEL: Record<AllocationType, string> = {
  SUM_INSURED: 'Sum Insured',
  PREMIUM: 'Premium',
  CLAIM: 'Claim',
};

const STATUS_LABEL = {
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  SETTLED: 'Settled',
} as const;

const SERIES_COLORS = {
  retention: colors.brownDark,
  quotaShare: '#A1887F',
  surplus: '#E0A93B',
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    dashboardApi
      .get()
      .then((res) => {
        if (active) setData(res.data.data);
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
  }, [reloadKey]);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  };

  if (loading && !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box>
        <Typography sx={{ color: 'error.main', mb: 2 }}>
          {error ?? 'Unable to load the dashboard'}
        </Typography>
        <Button variant="outlined" size="small" startIcon={<RefreshIcon />} onClick={handleRefresh}>
          Try again
        </Button>
      </Box>
    );
  }

  const customerCounts = data.customersPerMonth.map((m) => m.count);
  const policyTypes = data.policyByType.map((p) => p.policyType);
  const claimLabels = data.claimsByStatus.map((c) => `${STATUS_LABEL[c.status]} (${c.count})`);
  const shareLabels = data.proportionalShare.map((s) => ALLOCATION_LABEL[s.allocationType]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: colors.brownDark }}>
          Dashboard
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2 }}>
        {/* 1. Customers */}
        <ChartCard
          title="New Customers"
          subtitle="Registrations per month (last 6 months)"
          empty={customerCounts.every((c) => c === 0)}
          emptyText="No customers registered in the last 6 months"
        >
          <LineChart
            height={CHART_HEIGHT}
            xAxis={[
              { scaleType: 'point', data: data.customersPerMonth.map((m) => m.label) },
            ]}
            yAxis={[{ min: 0, valueFormatter: formatWholeNumber }]}
            series={[{ data: customerCounts, label: 'New customers', color: colors.brown }]}
          />
        </ChartCard>

        {/* 2. Sum insured and premium by policy type */}
        <ChartCard
          title="Policy Amounts by Type"
          subtitle="Total sum insured and premium"
          empty={data.policyByType.every((p) => p.sumInsured === 0 && p.premium === 0)}
          emptyText="No policies created yet"
        >
          <BarChart
            height={CHART_HEIGHT}
            xAxis={[{ scaleType: 'band', data: policyTypes }]}
            yAxis={[{ valueFormatter: formatCompact }]}
            series={[
              {
                data: data.policyByType.map((p) => p.sumInsured),
                label: 'Sum Insured',
                color: colors.brownDark,
                valueFormatter: formatTooltipAmount,
              },
              {
                data: data.policyByType.map((p) => p.premium),
                label: 'Premium',
                color: '#E0A93B',
                valueFormatter: formatTooltipAmount,
              },
            ]}
          />
        </ChartCard>

        {/* 3. Claims by status */}
        <ChartCard
          title="Claim Amount by Status"
          subtitle="Number of claims shown in brackets"
          empty={data.claimsByStatus.every((c) => c.count === 0)}
          emptyText="No claims raised yet"
        >
          <BarChart
            height={CHART_HEIGHT}
            xAxis={[{ scaleType: 'band', data: claimLabels }]}
            yAxis={[{ valueFormatter: formatCompact }]}
            series={[
              {
                data: data.claimsByStatus.map((c) => c.amount),
                label: 'Claim Amount',
                color: colors.brown,
                valueFormatter: formatTooltipAmount,
              },
            ]}
          />
        </ChartCard>

        {/* 4. Proportional allocation share */}
        <ChartCard
          title="Proportional Allocation Share"
          subtitle="Retention, quota share and surplus of each amount"
          empty={data.proportionalShare.every(
            (s) => s.retention === 0 && s.quotaShare === 0 && s.surplus === 0
          )}
          emptyText="No allocations yet"
        >
          <BarChart
            height={CHART_HEIGHT}
            xAxis={[{ scaleType: 'band', data: shareLabels }]}
            yAxis={[{ valueFormatter: formatCompact }]}
            series={[
              {
                data: data.proportionalShare.map((s) => s.retention),
                label: 'Retention',
                stack: 'total',
                color: SERIES_COLORS.retention,
                valueFormatter: formatTooltipAmount,
              },
              {
                data: data.proportionalShare.map((s) => s.quotaShare),
                label: 'Quota Share',
                stack: 'total',
                color: SERIES_COLORS.quotaShare,
                valueFormatter: formatTooltipAmount,
              },
              {
                data: data.proportionalShare.map((s) => s.surplus),
                label: 'Surplus',
                stack: 'total',
                color: SERIES_COLORS.surplus,
                valueFormatter: formatTooltipAmount,
              },
            ]}
          />
        </ChartCard>
      </Box>
    </Box>
  );
}
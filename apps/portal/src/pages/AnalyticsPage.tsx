import { useEffect, useState } from 'react';
import { Alert, Grid, MenuItem, Paper, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useBusinessContext } from '@rdplatforms/contexts';
import { useSettings } from '@rdplatforms/hooks';
import type { Sale } from '@rdplatforms/types';
import {
  categoryBreakdown,
  filterSalesSince,
  formatCurrency,
  startOfDay,
  startOfMonth,
  startOfWeek,
  sumSaleTotals,
} from '@rdplatforms/utils';
import { listSales, SalesAccessDeniedError } from '../api/salesApi';
import { useAuth } from '../auth/authContext';

type Period = 'today' | 'week' | 'month' | 'all';

const PERIOD_LABELS: Record<Period, string> = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
  all: 'All Time',
};

function periodStart(period: Period, now: Date): Date | undefined {
  switch (period) {
    case 'today':
      return startOfDay(now);
    case 'week':
      return startOfWeek(now);
    case 'month':
      return startOfMonth(now);
    case 'all':
      return undefined;
  }
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={700}>
        {value}
      </Typography>
    </Paper>
  );
}

export function AnalyticsPage() {
  const { business } = useBusinessContext();
  const { token } = useAuth();
  const { data: settings } = useSettings(business?.id ?? '');
  const currency = settings?.currency ?? 'USD';

  const [sales, setSales] = useState<Sale[]>();
  const [denied, setDenied] = useState(false);
  const [error, setError] = useState<string>();
  const [breakdownPeriod, setBreakdownPeriod] = useState<Period>('month');

  useEffect(() => {
    if (!token || !business) return;
    listSales(token, business.id)
      .then(setSales)
      .catch((err) => {
        if (err instanceof SalesAccessDeniedError) {
          setDenied(true);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load analytics.');
        }
      });
  }, [token, business]);

  if (denied) {
    return (
      <Alert severity="info">
        Full sales analytics requires the Owner role, or Staff access granted by your Owner (the "can view full
        analytics" permission on the Staff page).
      </Alert>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!sales) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={100} />
        <Skeleton variant="rounded" height={200} />
      </Stack>
    );
  }

  const now = new Date();
  const todayTotal = sumSaleTotals(filterSalesSince(sales, startOfDay(now)));
  const weekTotal = sumSaleTotals(filterSalesSince(sales, startOfWeek(now)));
  const monthTotal = sumSaleTotals(filterSalesSince(sales, startOfMonth(now)));
  const allTimeTotal = sumSaleTotals(sales);

  const breakdownStart = periodStart(breakdownPeriod, now);
  const breakdownSales = breakdownStart ? filterSalesSince(sales, breakdownStart) : sales;
  const breakdown = categoryBreakdown(breakdownSales);

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Analytics
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <StatTile label="Today" value={formatCurrency(todayTotal, currency)} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatTile label="This Week" value={formatCurrency(weekTotal, currency)} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatTile label="This Month" value={formatCurrency(monthTotal, currency)} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatTile label="All Time" value={formatCurrency(allTimeTotal, currency)} />
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              Category breakdown
            </Typography>
            <TextField
              select
              size="small"
              value={breakdownPeriod}
              onChange={(e) => setBreakdownPeriod(e.target.value as Period)}
              sx={{ minWidth: 160 }}
            >
              {(Object.keys(PERIOD_LABELS) as Period[]).map((period) => (
                <MenuItem key={period} value={period}>
                  {PERIOD_LABELS[period]}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          {breakdown.length === 0 ? (
            <Typography color="text.secondary">No sales in this period yet.</Typography>
          ) : (
            <Stack spacing={1}>
              {breakdown.map(({ category, total }) => (
                <Stack key={category} direction="row" justifyContent="space-between">
                  <Typography>{category}</Typography>
                  <Typography fontWeight={600}>{formatCurrency(total, currency)}</Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}

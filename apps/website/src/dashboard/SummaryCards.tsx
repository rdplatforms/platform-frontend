import { Stack } from '@mui/material';
import type { SaleEntry } from '@rdplatforms/types';
import {
  filterSince,
  formatCurrency,
  startOfDay,
  startOfMonth,
  startOfWeek,
  sumSales,
} from '@rdplatforms/utils';
import { StatCard } from './StatCard';

export interface SummaryCardsProps {
  sales: SaleEntry[];
  currency: string;
}

export function SummaryCards({ sales, currency }: SummaryCardsProps) {
  const now = new Date();
  const today = sumSales(filterSince(sales, startOfDay(now)));
  const thisWeek = sumSales(filterSince(sales, startOfWeek(now)));
  const thisMonth = sumSales(filterSince(sales, startOfMonth(now)));
  const allTime = sumSales(sales);

  return (
    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
      <StatCard label="Today" value={formatCurrency(today, currency)} />
      <StatCard label="This Week" value={formatCurrency(thisWeek, currency)} />
      <StatCard label="This Month" value={formatCurrency(thisMonth, currency)} />
      <StatCard label="All Time" value={formatCurrency(allTime, currency)} />
    </Stack>
  );
}

/**
 * Generic date-bucketing helpers, reused by apps/portal's Analytics page
 * (@rdplatforms/utils' saleAnalytics.ts) for Today/Week/Month totals.
 * Originally written for the old client-only SaleEntry dashboard (see
 * ADR 0012) — kept because the date math itself was never SaleEntry-
 * specific, only the totaling functions that lived alongside it were.
 */
export function startOfDay(reference: Date): Date {
  const start = new Date(reference);
  start.setHours(0, 0, 0, 0);
  return start;
}

/** Monday-based start of week, matching Business.hours' day ordering. */
export function startOfWeek(reference: Date): Date {
  const start = startOfDay(reference);
  const day = start.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  start.setDate(start.getDate() - diffToMonday);
  return start;
}

export function startOfMonth(reference: Date): Date {
  const start = startOfDay(reference);
  start.setDate(1);
  return start;
}

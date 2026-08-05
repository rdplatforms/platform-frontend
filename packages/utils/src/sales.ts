export interface SaleAmount {
  quantity: number;
  unitPrice: number;
}

export function getSaleTotal(entry: SaleAmount): number {
  return entry.quantity * entry.unitPrice;
}

export function sumSales(entries: SaleAmount[]): number {
  return entries.reduce((sum, entry) => sum + getSaleTotal(entry), 0);
}

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

export function filterSince<T extends { occurredAt: string }>(entries: T[], since: Date): T[] {
  return entries.filter((entry) => new Date(entry.occurredAt) >= since);
}

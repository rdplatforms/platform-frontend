import type { Sale } from '@rdplatforms/types';

export interface CategoryTotal {
  category: string;
  total: number;
}

export function sumSaleTotals(sales: Sale[]): number {
  return sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
}

export function filterSalesSince(sales: Sale[], since: Date): Sale[] {
  return sales.filter((sale) => new Date(sale.createdAt) >= since);
}

/**
 * Sums each line item's own (quantity * unitPrice - discount) grouped by
 * category, not each Sale's pre-computed totalAmount — a single bill can
 * span several categories, so category-wise analytics has to look inside
 * every Sale's items, not just its total. An item with no category (an
 * ad-hoc entry not picked from the catalog) is grouped under
 * "Uncategorized" rather than dropped. Sorted highest total first.
 */
export function categoryBreakdown(sales: Sale[]): CategoryTotal[] {
  const totals = new Map<string, number>();
  for (const sale of sales) {
    for (const item of sale.items) {
      const category = item.category?.trim() || 'Uncategorized';
      const lineTotal = item.quantity * item.unitPrice - item.discount;
      totals.set(category, (totals.get(category) ?? 0) + lineTotal);
    }
  }
  return Array.from(totals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

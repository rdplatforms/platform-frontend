import { describe, expect, it } from 'vitest';
import { categoryBreakdown, filterSalesSince, sumSaleTotals } from '../src/saleAnalytics';
import type { Sale } from '@rdplatforms/types';

function makeSale(overrides: Partial<Sale> & { items: Sale['items'] }): Sale {
  return {
    id: 'sale-1',
    businessId: 'biz-1',
    source: 'STAFF',
    paymentMethod: 'CASH',
    totalAmount: 0,
    createdAt: '2026-06-15T10:00:00.000Z',
    ...overrides,
  };
}

describe('sumSaleTotals', () => {
  it('sums each sale\'s pre-computed totalAmount', () => {
    const sales = [makeSale({ totalAmount: 100, items: [] }), makeSale({ totalAmount: 250, items: [] })];
    expect(sumSaleTotals(sales)).toBe(350);
  });
});

describe('filterSalesSince', () => {
  it('keeps only sales at or after the cutoff', () => {
    const sales = [
      makeSale({ createdAt: '2026-06-01T00:00:00.000Z', items: [] }),
      makeSale({ createdAt: '2026-06-20T00:00:00.000Z', items: [] }),
    ];
    const result = filterSalesSince(sales, new Date('2026-06-10T00:00:00.000Z'));
    expect(result).toHaveLength(1);
    expect(result[0].createdAt).toBe('2026-06-20T00:00:00.000Z');
  });
});

describe('categoryBreakdown', () => {
  it('sums per-line-item totals grouped by category, across sales', () => {
    const sales = [
      makeSale({
        items: [
          { id: '1', label: 'Haircut', category: 'hair', quantity: 2, unitPrice: 300, discount: 50 },
          { id: '2', label: 'Shampoo', category: 'retail', quantity: 1, unitPrice: 150, discount: 0 },
        ],
      }),
      makeSale({
        items: [{ id: '3', label: 'Trim', category: 'hair', quantity: 1, unitPrice: 100, discount: 0 }],
      }),
    ];
    const breakdown = categoryBreakdown(sales);
    expect(breakdown).toEqual([
      { category: 'hair', total: 650 },
      { category: 'retail', total: 150 },
    ]);
  });

  it('groups items with no category under "Uncategorized"', () => {
    const sales = [
      makeSale({ items: [{ id: '1', label: 'Custom', quantity: 1, unitPrice: 50, discount: 0 }] }),
    ];
    expect(categoryBreakdown(sales)).toEqual([{ category: 'Uncategorized', total: 50 }]);
  });
});

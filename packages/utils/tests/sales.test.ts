import { describe, expect, it } from 'vitest';
import {
  filterSince,
  getSaleTotal,
  startOfDay,
  startOfMonth,
  startOfWeek,
  sumSales,
} from '../src/sales';

describe('getSaleTotal', () => {
  it('multiplies quantity by unit price', () => {
    expect(getSaleTotal({ quantity: 3, unitPrice: 25 })).toBe(75);
  });
});

describe('sumSales', () => {
  it('sums totals across entries', () => {
    expect(
      sumSales([
        { quantity: 2, unitPrice: 10 },
        { quantity: 1, unitPrice: 5 },
      ]),
    ).toBe(25);
  });

  it('returns 0 for an empty list', () => {
    expect(sumSales([])).toBe(0);
  });
});

describe('startOfDay', () => {
  it('zeroes the time portion', () => {
    const start = startOfDay(new Date('2026-08-05T14:32:00'));
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
    expect(start.getDate()).toBe(5);
  });
});

describe('startOfWeek', () => {
  it('rolls back to Monday when reference is midweek', () => {
    // 2026-08-05 is a Wednesday
    const start = startOfWeek(new Date('2026-08-05T14:32:00'));
    expect(start.getDay()).toBe(1);
    expect(start.getDate()).toBe(3);
  });

  it('stays put when reference is already Monday', () => {
    const start = startOfWeek(new Date('2026-08-03T09:00:00'));
    expect(start.getDate()).toBe(3);
  });

  it('rolls back correctly across a Sunday reference', () => {
    // 2026-08-09 is a Sunday — should roll back to Monday 2026-08-03
    const start = startOfWeek(new Date('2026-08-09T09:00:00'));
    expect(start.getDate()).toBe(3);
  });
});

describe('startOfMonth', () => {
  it('resets to the 1st of the month', () => {
    const start = startOfMonth(new Date('2026-08-05T14:32:00'));
    expect(start.getDate()).toBe(1);
    expect(start.getMonth()).toBe(7);
  });
});

describe('filterSince', () => {
  const entries = [
    { occurredAt: '2026-08-01', label: 'old' },
    { occurredAt: '2026-08-05', label: 'new' },
  ];

  it('keeps only entries on or after the cutoff', () => {
    const result = filterSince(entries, new Date('2026-08-03'));
    expect(result.map((e) => e.label)).toEqual(['new']);
  });

  it('keeps everything when the cutoff is in the past', () => {
    const result = filterSince(entries, new Date('2026-01-01'));
    expect(result).toHaveLength(2);
  });
});

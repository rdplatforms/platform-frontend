import { describe, expect, it } from 'vitest';
import { startOfDay, startOfMonth, startOfWeek } from '../src/sales';

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

import { describe, expect, it } from 'vitest';
import type { BusinessHours } from '@rdplatforms/types';
import {
  generateTimeSlots,
  getBusinessHoursForDate,
  getDayOfWeek,
  isBusinessOpenNow,
} from '../src/businessHours';

const SALON_HOURS: BusinessHours[] = [
  { day: 'monday', opensAt: null, closesAt: null, isClosed: true },
  { day: 'tuesday', opensAt: '10:00', closesAt: '22:00', isClosed: false },
  { day: 'wednesday', opensAt: '10:00', closesAt: '22:00', isClosed: false },
  { day: 'thursday', opensAt: '10:00', closesAt: '22:00', isClosed: false },
  { day: 'friday', opensAt: '10:00', closesAt: '22:00', isClosed: false },
  { day: 'saturday', opensAt: '10:00', closesAt: '22:00', isClosed: false },
  { day: 'sunday', opensAt: '10:00', closesAt: '22:00', isClosed: false },
];

describe('getDayOfWeek', () => {
  it('reads the correct day regardless of timezone parsing pitfalls', () => {
    // 2026-08-10 is a Monday
    expect(getDayOfWeek('2026-08-10')).toBe('monday');
    // 2026-08-11 is a Tuesday
    expect(getDayOfWeek('2026-08-11')).toBe('tuesday');
  });
});

describe('getBusinessHoursForDate', () => {
  it('finds the matching day entry', () => {
    expect(getBusinessHoursForDate(SALON_HOURS, '2026-08-11')?.day).toBe('tuesday');
  });

  it('returns undefined when no entry exists for that day', () => {
    expect(getBusinessHoursForDate([], '2026-08-11')).toBeUndefined();
  });
});

describe('generateTimeSlots', () => {
  it('produces 12 hourly slots for a 10am-10pm day', () => {
    const slots = generateTimeSlots('10:00', '22:00', 60);
    expect(slots).toHaveLength(12);
    expect(slots[0]).toBe('10:00');
    expect(slots[slots.length - 1]).toBe('21:00');
  });

  it('respects a custom slot length', () => {
    const slots = generateTimeSlots('10:00', '11:00', 30);
    expect(slots).toEqual(['10:00', '10:30']);
  });

  it('defaults to 60-minute slots', () => {
    expect(generateTimeSlots('09:00', '12:00')).toEqual(['09:00', '10:00', '11:00']);
  });
});

describe('isBusinessOpenNow', () => {
  it('is open during business hours on an open day', () => {
    expect(isBusinessOpenNow(SALON_HOURS, new Date('2026-08-11T15:00:00'))).toBe(true);
  });

  it('is closed before opening time', () => {
    expect(isBusinessOpenNow(SALON_HOURS, new Date('2026-08-11T09:00:00'))).toBe(false);
  });

  it('is closed after closing time', () => {
    expect(isBusinessOpenNow(SALON_HOURS, new Date('2026-08-11T22:30:00'))).toBe(false);
  });

  it('is closed on a day marked isClosed', () => {
    expect(isBusinessOpenNow(SALON_HOURS, new Date('2026-08-10T15:00:00'))).toBe(false);
  });

  it('treats a business with no hours data as open, not closed', () => {
    expect(isBusinessOpenNow([], new Date('2026-08-10T15:00:00'))).toBe(true);
  });
});

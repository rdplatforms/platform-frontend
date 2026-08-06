import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  formatDayLabel,
  formatDurationMinutes,
  formatHoursRange,
  formatPhoneForDisplay,
  toWhatsAppLink,
} from '../src/formatters';

describe('formatCurrency', () => {
  it('formats USD by default', () => {
    expect(formatCurrency(45)).toBe('$45.00');
  });

  it('formats a different currency', () => {
    expect(formatCurrency(45, 'EUR', 'de-DE')).toContain('45');
  });
});

describe('formatDurationMinutes', () => {
  it('formats minutes under an hour', () => {
    expect(formatDurationMinutes(45)).toBe('45 min');
  });

  it('formats exact hours', () => {
    expect(formatDurationMinutes(120)).toBe('2 hr');
  });

  it('formats hours with remainder minutes', () => {
    expect(formatDurationMinutes(90)).toBe('1 hr 30 min');
  });
});

describe('formatPhoneForDisplay', () => {
  it('formats a 10-digit US number', () => {
    expect(formatPhoneForDisplay('5551234567')).toBe('(555) 123-4567');
  });

  it('returns the original value when not 10 digits and not a +91 number', () => {
    expect(formatPhoneForDisplay('12345')).toBe('12345');
  });

  it('formats a +91 Indian number with 5-5 grouping', () => {
    expect(formatPhoneForDisplay('+919175477076')).toBe('+91 91754 77076');
  });

  it('formats a +91 number that already has spacing, unchanged', () => {
    expect(formatPhoneForDisplay('+91 98765 43210')).toBe('+91 98765 43210');
  });
});

describe('toWhatsAppLink', () => {
  it('builds a wa.me link from digits only', () => {
    expect(toWhatsAppLink('+1 (555) 123-4567')).toBe('https://wa.me/15551234567');
  });

  it('encodes an optional prefilled message', () => {
    expect(toWhatsAppLink('5551234567', 'Hi there')).toBe(
      'https://wa.me/5551234567?text=Hi%20there',
    );
  });
});

describe('formatHoursRange', () => {
  it('returns Closed when either bound is null', () => {
    expect(formatHoursRange(null, null)).toBe('Closed');
  });

  it('returns the Marathi closed label when locale is mr', () => {
    expect(formatHoursRange(null, null, 'mr')).toBe('बंद');
  });

  it('formats an open range', () => {
    expect(formatHoursRange('09:00', '18:00')).toBe('09:00 - 18:00');
  });
});

describe('formatDayLabel', () => {
  it('defaults to English', () => {
    expect(formatDayLabel('monday')).toBe('Monday');
  });

  it('returns the Marathi day name when locale is mr', () => {
    expect(formatDayLabel('monday', 'mr')).toBe('सोमवार');
  });
});

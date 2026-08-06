import type { BusinessAddress } from '@rdplatforms/types';

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDurationMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder === 0 ? `${hours} hr` : `${hours} hr ${remainder} min`;
}

export function formatPhoneForDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (phone.trim().startsWith('+91') && digits.length === 12) {
    const national = digits.slice(2);
    return `+91 ${national.slice(0, 5)} ${national.slice(5)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function toWhatsAppLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '');
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${query}`;
}

/**
 * Joins only the address parts that are actually present — a business
 * whose full formatted street address isn't confirmed yet (see
 * BusinessAddress) shouldn't render "undefined, undefined".
 */
export function formatAddressLine(address: BusinessAddress): string {
  const cityState = [address.city, address.state].filter(Boolean).join(', ');
  return [address.line1, cityState, address.postalCode].filter(Boolean).join(', ');
}

const DAY_LABELS: Record<'en' | 'mr', Record<string, string>> = {
  en: {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  },
  mr: {
    monday: 'सोमवार',
    tuesday: 'मंगळवार',
    wednesday: 'बुधवार',
    thursday: 'गुरुवार',
    friday: 'शुक्रवार',
    saturday: 'शनिवार',
    sunday: 'रविवार',
  },
};

export function formatDayLabel(day: string, locale: 'en' | 'mr' = 'en'): string {
  return DAY_LABELS[locale][day] ?? day;
}

export function formatHoursRange(
  opensAt: string | null,
  closesAt: string | null,
  locale: 'en' | 'mr' = 'en',
): string {
  if (!opensAt || !closesAt) {
    return locale === 'mr' ? 'बंद' : 'Closed';
  }
  return `${opensAt} - ${closesAt}`;
}

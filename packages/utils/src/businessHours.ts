import type { BusinessHours } from '@rdplatforms/types';

const DAY_KEYS: BusinessHours['day'][] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

/**
 * Reads the day-of-week out of a "YYYY-MM-DD" string using local date
 * components directly (new Date(year, month, day)) rather than parsing the
 * string as UTC — Date.parse('2026-08-10') is midnight UTC, which can land
 * on the *previous* calendar day in any timezone behind UTC, silently
 * picking the wrong day's hours.
 */
export function getDayOfWeek(dateStr: string): BusinessHours['day'] {
  const [year, month, day] = dateStr.split('-').map(Number);
  const jsDay = new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1).getDay();
  return DAY_KEYS[jsDay] as BusinessHours['day'];
}

export function getBusinessHoursForDate(
  hours: BusinessHours[],
  dateStr: string,
): BusinessHours | undefined {
  const day = getDayOfWeek(dateStr);
  return hours.find((entry) => entry.day === day);
}

/**
 * Hourly (or any slotMinutes) start times between opensAt and closesAt,
 * e.g. ("10:00", "22:00", 60) -> 12 slots, "10:00".."21:00". The slot
 * count is never hardcoded anywhere — it falls out of whatever hours and
 * slot length the business's own data declares.
 */
export function generateTimeSlots(
  opensAt: string,
  closesAt: string,
  slotMinutes: number = 60,
): string[] {
  const start = timeToMinutes(opensAt);
  const end = timeToMinutes(closesAt);
  const slots: string[] = [];
  for (let t = start; t < end; t += slotMinutes) {
    const hours = Math.floor(t / 60)
      .toString()
      .padStart(2, '0');
    const minutes = (t % 60).toString().padStart(2, '0');
    slots.push(`${hours}:${minutes}`);
  }
  return slots;
}

/**
 * Whether the business is open right now, per its own BusinessHours data.
 * A business with no hours configured (an empty array, or no entry for
 * today) is treated as open — absence of data is never treated as "closed"
 * (that would show a false "we're closed" banner for every business that
 * simply hasn't filled in hours yet).
 */
export function isBusinessOpenNow(hours: BusinessHours[], now: Date = new Date()): boolean {
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`;
  const today = getBusinessHoursForDate(hours, dateStr);

  if (!today) {
    return true;
  }
  if (today.isClosed || !today.opensAt || !today.closesAt) {
    return false;
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return nowMinutes >= timeToMinutes(today.opensAt) && nowMinutes < timeToMinutes(today.closesAt);
}

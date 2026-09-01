import type { SupportedLocale } from '@rdplatforms/types';
import { translateUi } from './uiStrings';

export interface AppointmentDetails {
  customerName: string;
  customerPhone: string;
  serviceName: string;
  preferredDate: string;
  preferredTime: string;
  note?: string;
}

/**
 * Formats an appointment request into a plain-text message for the
 * WhatsApp handoff (see Appointment section) — there's no backend to
 * submit this to, so the customer's own WhatsApp send is what actually
 * delivers it.
 */
export function buildAppointmentMessage(
  details: AppointmentDetails,
  locale: SupportedLocale,
): string {
  const lines = [
    translateUi('appointmentRequestHeading', locale),
    `${translateUi('name', locale)}: ${details.customerName}`,
    `${translateUi('phone', locale)}: ${details.customerPhone}`,
    `${translateUi('service', locale)}: ${details.serviceName}`,
    `${translateUi('preferredDate', locale)}: ${details.preferredDate}`,
    `${translateUi('preferredTime', locale)}: ${details.preferredTime}`,
  ];
  if (details.note) {
    lines.push(`${translateUi('note', locale)}: ${details.note}`);
  }
  return lines.join('\n');
}

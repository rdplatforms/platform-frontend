import type { SupportedLocale } from '@rdplatforms/types';
import { translateUi } from './uiStrings';

export interface ContactMessageDetails {
  name: string;
  email?: string;
  message: string;
}

/**
 * Same WhatsApp-handoff shape as buildAppointmentMessage, for the general
 * "Get In Touch" section — see docs/appointments.md for the shared
 * reasoning (no backend, customer's own send is what delivers it).
 */
export function buildContactMessage(
  details: ContactMessageDetails,
  locale: SupportedLocale,
): string {
  const lines = [
    `${translateUi('name', locale)}: ${details.name}`,
    ...(details.email ? [`${translateUi('email', locale)}: ${details.email}`] : []),
    `${translateUi('message', locale)}: ${details.message}`,
  ];
  return lines.join('\n');
}

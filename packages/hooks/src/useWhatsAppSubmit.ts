import { useState } from 'react';
import { toWhatsAppLink } from '@rdplatforms/utils';

/**
 * Shared "build a message, hand it to WhatsApp, show a sent state" flow —
 * both Appointment and Contact use this instead of each reimplementing it.
 * See docs/appointments.md for why WhatsApp rather than a real submission.
 */
export function useWhatsAppSubmit(whatsappNumber: string) {
  const [sent, setSent] = useState(false);

  function send(message: string) {
    window.open(toWhatsAppLink(whatsappNumber, message), '_blank', 'noopener,noreferrer');
    setSent(true);
  }

  function reset() {
    setSent(false);
  }

  return { sent, send, reset };
}

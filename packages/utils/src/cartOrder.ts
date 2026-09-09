import type { SupportedLocale } from '@rdplatforms/types';
import { formatCurrency } from './formatters';
import { translateUi } from './uiStrings';

export interface CartOrderItemDetails {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface CartOrderDetails {
  customerName: string;
  items: CartOrderItemDetails[];
  subtotal: number;
  currency: string;
  paymentMethod: string;
}

/**
 * Formats a cart into a plain-text message for the WhatsApp handoff — see
 * CartPage. Mirrors buildAppointmentMessage: no phone number field, since
 * WhatsApp already shows the business owner the sender's number.
 */
export function buildCartOrderMessage(details: CartOrderDetails, locale: SupportedLocale): string {
  const lines = [
    translateUi('orderRequestHeading', locale),
    `${translateUi('name', locale)}: ${details.customerName}`,
    ...details.items.map(
      (item) =>
        `- ${item.name} x${item.quantity} — ${formatCurrency(item.unitPrice * item.quantity, details.currency)}`,
    ),
    `${translateUi('subtotal', locale)}: ${formatCurrency(details.subtotal, details.currency)}`,
    `${translateUi('paymentMethod', locale)}: ${details.paymentMethod}`,
  ];
  return lines.join('\n');
}

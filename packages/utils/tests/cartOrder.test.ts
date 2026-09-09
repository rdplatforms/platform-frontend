import { describe, expect, it } from 'vitest';
import { buildCartOrderMessage } from '../src/cartOrder';

describe('buildCartOrderMessage', () => {
  const base = {
    customerName: 'Priya Sharma',
    items: [
      { name: 'Kundan Necklace Set', quantity: 1, unitPrice: 1499 },
      { name: 'Jhumka Earrings', quantity: 2, unitPrice: 399 },
    ],
    subtotal: 2297,
    currency: 'INR',
    paymentMethod: 'UPI',
  };

  it('formats an English message with a heading, customer name, one line per item, and a total', () => {
    const message = buildCartOrderMessage(base, 'en');
    expect(message).toContain('New Order Request');
    expect(message).toContain('Name: Priya Sharma');
    expect(message).toContain('Kundan Necklace Set x1');
    expect(message).toContain('Jhumka Earrings x2');
    expect(message).toContain('Payment Method: UPI');
  });

  it('does not include a phone line — WhatsApp already reveals the sender', () => {
    const message = buildCartOrderMessage(base, 'en');
    expect(message).not.toContain('Phone');
  });

  it('formats a Marathi message using Marathi labels', () => {
    const message = buildCartOrderMessage(base, 'mr');
    expect(message).toContain('नवीन ऑर्डर विनंती');
    expect(message).toContain('नाव: Priya Sharma');
  });

  it('lists every item with quantity and line total', () => {
    const message = buildCartOrderMessage(base, 'en');
    const lines = message.split('\n');
    expect(lines.some((line) => line.includes('Kundan Necklace Set x1'))).toBe(true);
    expect(lines.some((line) => line.includes('Jhumka Earrings x2'))).toBe(true);
  });
});

import type { NewSale, Sale } from '@rdplatforms/types';
import { HttpCheckoutDataSource } from './dataSource/HttpCheckoutDataSource';

// Same local-cast reasoning as activeDataSource.ts — see that file's comment.
const apiBaseUrl = (import.meta as unknown as { env?: Record<string, string | undefined> }).env
  ?.VITE_API_BASE_URL;

/**
 * Rejects when no backend is configured (Tier 1) or the request fails —
 * this class itself makes no attempt at a fallback. CartPage is what
 * makes checkout best-effort in practice: it awaits this and swallows any
 * error before always firing the WhatsApp handoff regardless, the same
 * shape BookingService gets for free from its own tier check. See
 * docs/shop.md and the Appointment section for the same pattern.
 */
export class CheckoutService {
  constructor(private readonly dataSource: HttpCheckoutDataSource | undefined) {}

  createSale(businessId: string, sale: NewSale): Promise<Sale> {
    if (!this.dataSource) {
      return Promise.reject(new Error('Checkout is not available right now.'));
    }
    return this.dataSource.createSale(businessId, sale);
  }
}

export const checkoutService = new CheckoutService(
  apiBaseUrl ? new HttpCheckoutDataSource(apiBaseUrl) : undefined,
);

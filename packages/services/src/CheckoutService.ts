import type { NewSale, Sale } from '@rdplatforms/types';
import { HttpCheckoutDataSource } from './dataSource/HttpCheckoutDataSource';

// Same local-cast reasoning as activeDataSource.ts — see that file's comment.
const apiBaseUrl = (import.meta as unknown as { env?: Record<string, string | undefined> }).env
  ?.VITE_API_BASE_URL;

/**
 * Deliberately NOT best-effort like BookingService — there's no
 * WhatsApp-style fallback channel for an order the way there is for an
 * appointment request, so a checkout that can't reach the backend must
 * surface as a real, visible error, not fail silently.
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

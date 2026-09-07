import type { NewSale, Sale } from '@rdplatforms/types';

/**
 * Public, unauthenticated checkout (TASKS.md Milestone 6) — hits the
 * same POST /businesses/{id}/sales endpoint apps/portal's billing uses,
 * but with no bearer token, which is exactly what makes the backend
 * record source: ONLINE instead of STAFF (see SaleController).
 */
export class HttpCheckoutDataSource {
  constructor(private readonly baseUrl: string) {}

  async createSale(businessId: string, sale: NewSale): Promise<Sale> {
    const res = await fetch(`${this.baseUrl}/businesses/${encodeURIComponent(businessId)}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sale),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => undefined);
      throw new Error(body?.message ?? 'Failed to place order.');
    }
    return res.json();
  }
}

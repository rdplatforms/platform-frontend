import type { Product } from '@rdplatforms/types';

/**
 * Products are backend-only (no JsonDataSource/static-data fallback) —
 * unlike the read-only content types, a Product needs real CRUD from
 * day one (apps/portal, TASK-023), so there was never a static-data
 * seed path for the website to fall back to the way there is for
 * services/gallery/etc. If no backend is configured, listByBusiness
 * resolves to an empty list rather than throwing — the shop section
 * just shows nothing, same tolerance BookingService has for "no backend
 * configured."
 */
export class HttpProductDataSource {
  constructor(private readonly baseUrl: string | undefined) {}

  async listByBusiness(businessId: string): Promise<Product[]> {
    if (!this.baseUrl) {
      return [];
    }
    const res = await fetch(`${this.baseUrl}/businesses/${encodeURIComponent(businessId)}/products`);
    if (!res.ok) {
      return [];
    }
    return res.json();
  }
}

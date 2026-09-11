import type { Product } from '@rdplatforms/types';
import { activeDataSource } from './dataSource/activeDataSource';

/**
 * Read-only product listing, same tier-selection seam every other
 * read-only content type uses (activeDataSource.ts) — a Tier 1 business
 * with no backend gets its products from static-data/products.json, a
 * Tier 3 business gets them from platform-backend. Write access
 * (apps/portal's Products page, Owner-only CRUD) stays backend-only,
 * unaffected by this — see docs/shop.md.
 */
export class ProductService {
  getByBusiness(businessId: string): Promise<Product[]> {
    return activeDataSource.listProductsByBusiness(businessId);
  }
}

export const productService = new ProductService();

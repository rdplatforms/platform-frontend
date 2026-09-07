import type { Product } from '@rdplatforms/types';
import { HttpProductDataSource } from './dataSource/HttpProductDataSource';

// Same local-cast reasoning as activeDataSource.ts — see that file's comment.
const apiBaseUrl = (import.meta as unknown as { env?: Record<string, string | undefined> }).env
  ?.VITE_API_BASE_URL;

const httpProductDataSource = new HttpProductDataSource(apiBaseUrl);

export class ProductService {
  constructor(private readonly dataSource: HttpProductDataSource) {}

  getByBusiness(businessId: string): Promise<Product[]> {
    return this.dataSource.listByBusiness(businessId);
  }
}

export const productService = new ProductService(httpProductDataSource);

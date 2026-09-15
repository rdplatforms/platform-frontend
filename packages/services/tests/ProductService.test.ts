import { describe, expect, it } from 'vitest';
import { JsonDataSource } from '../src/dataSource/JsonDataSource';
import { productService } from '../src/ProductService';

describe('products static fallback', () => {
  const ds = new JsonDataSource();

  it('JsonDataSource resolves jagdamb-creation products with sku and businessId filled in', async () => {
    const products = await ds.listProductsByBusiness('jagdamb-creation');
    expect(products.length).toBe(6);
    expect(products[0].sku).toBe('JC-NEC-001');
    expect(products[0].businessId).toBe('jagdamb-creation');
    expect(products[0].createdAt).toBeTruthy();
  });

  it('returns empty array for an unknown business, not an error', async () => {
    const products = await ds.listProductsByBusiness('does-not-exist');
    expect(products).toEqual([]);
  });

  it('ProductService (Tier 1, no VITE_API_BASE_URL) resolves the same static data', async () => {
    const products = await productService.getByBusiness('jagdamb-creation');
    expect(products.length).toBe(6);
    expect(products.map((p) => p.sku)).toEqual([
      'JC-NEC-001',
      'JC-BRD-001',
      'JC-EAR-001',
      'JC-HRJ-001',
      'JC-BNG-001',
      'JC-NEC-002',
    ]);
  });
});

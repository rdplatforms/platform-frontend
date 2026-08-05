import { beforeEach, describe, expect, it } from 'vitest';
import type { StorageLike } from '../src/dataSource/LocalStorageDataSource';
import { LocalStorageSalesDataSource } from '../src/dataSource/LocalStorageDataSource';

function fakeStorage(): StorageLike {
  const memory = new Map<string, string>();
  return {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
    removeItem: (key) => memory.delete(key),
  };
}

describe('LocalStorageSalesDataSource', () => {
  let dataSource: LocalStorageSalesDataSource;

  beforeEach(() => {
    dataSource = new LocalStorageSalesDataSource(fakeStorage());
  });

  it('starts empty for a business with no recorded sales', async () => {
    expect(await dataSource.listSalesByBusiness('royal-salon')).toEqual([]);
  });

  it('creates a sale and assigns an id and createdAt', async () => {
    const created = await dataSource.createSale({
      businessId: 'royal-salon',
      kind: 'service',
      label: 'Haircut',
      quantity: 1,
      unitPrice: 65,
      currency: 'USD',
      occurredAt: '2026-08-05',
    });

    expect(created.id).toBeTruthy();
    expect(created.createdAt).toBeTruthy();

    const all = await dataSource.listSalesByBusiness('royal-salon');
    expect(all).toHaveLength(1);
    expect(all[0]?.label).toBe('Haircut');
  });

  it('keeps sales isolated per business', async () => {
    await dataSource.createSale({
      businessId: 'royal-salon',
      kind: 'service',
      label: 'Haircut',
      quantity: 1,
      unitPrice: 65,
      currency: 'USD',
      occurredAt: '2026-08-05',
    });
    await dataSource.createSale({
      businessId: 'urban-bistro',
      kind: 'product',
      label: 'Bottle of wine',
      quantity: 2,
      unitPrice: 20,
      currency: 'USD',
      occurredAt: '2026-08-05',
    });

    expect(await dataSource.listSalesByBusiness('royal-salon')).toHaveLength(1);
    expect(await dataSource.listSalesByBusiness('urban-bistro')).toHaveLength(1);
  });

  it('sorts newest occurredAt first', async () => {
    await dataSource.createSale({
      businessId: 'royal-salon',
      kind: 'service',
      label: 'Older',
      quantity: 1,
      unitPrice: 10,
      currency: 'USD',
      occurredAt: '2026-08-01',
    });
    await dataSource.createSale({
      businessId: 'royal-salon',
      kind: 'service',
      label: 'Newer',
      quantity: 1,
      unitPrice: 10,
      currency: 'USD',
      occurredAt: '2026-08-05',
    });

    const all = await dataSource.listSalesByBusiness('royal-salon');
    expect(all.map((entry) => entry.label)).toEqual(['Newer', 'Older']);
  });

  it('deletes a sale by id without affecting other entries', async () => {
    const first = await dataSource.createSale({
      businessId: 'royal-salon',
      kind: 'service',
      label: 'Haircut',
      quantity: 1,
      unitPrice: 65,
      currency: 'USD',
      occurredAt: '2026-08-05',
    });
    await dataSource.createSale({
      businessId: 'royal-salon',
      kind: 'product',
      label: 'Shampoo',
      quantity: 1,
      unitPrice: 18,
      currency: 'USD',
      occurredAt: '2026-08-05',
    });

    await dataSource.deleteSale(first.id, 'royal-salon');

    const remaining = await dataSource.listSalesByBusiness('royal-salon');
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.label).toBe('Shampoo');
  });
});

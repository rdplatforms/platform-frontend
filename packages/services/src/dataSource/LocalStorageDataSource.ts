import type { NewSaleEntry, SaleEntry } from '@rdplatforms/types';
import type { SalesDataSource } from './types';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Falls back to an in-memory map outside a browser (SSR, or a test that
 * doesn't inject its own fake) so this data source never throws just
 * because `window.localStorage` isn't there — it just won't persist.
 */
function createInMemoryStorage(): StorageLike {
  const memory = new Map<string, string>();
  return {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
    removeItem: (key) => memory.delete(key),
  };
}

function resolveStorage(explicit?: StorageLike): StorageLike {
  if (explicit) {
    return explicit;
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return createInMemoryStorage();
}

/**
 * Sales are stored entirely client-side today, namespaced per business, as
 * a deliberately temporary bridge until a real backend exists — see
 * docs/business-dashboard.md for the tradeoffs and the planned
 * MongoDB-backed HttpDataSource migration.
 */
export class LocalStorageSalesDataSource implements SalesDataSource {
  private readonly storage: StorageLike;

  constructor(storage?: StorageLike) {
    this.storage = resolveStorage(storage);
  }

  private key(businessId: string): string {
    return `rdplatforms:sales:${businessId}`;
  }

  private readAll(businessId: string): SaleEntry[] {
    const raw = this.storage.getItem(this.key(businessId));
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw) as SaleEntry[];
    } catch {
      return [];
    }
  }

  private writeAll(businessId: string, entries: SaleEntry[]): void {
    this.storage.setItem(this.key(businessId), JSON.stringify(entries));
  }

  async listSalesByBusiness(businessId: string): Promise<SaleEntry[]> {
    return [...this.readAll(businessId)].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }

  async createSale(input: NewSaleEntry): Promise<SaleEntry> {
    const entry: SaleEntry = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const all = this.readAll(input.businessId);
    all.push(entry);
    this.writeAll(input.businessId, all);
    return entry;
  }

  async deleteSale(id: string, businessId: string): Promise<void> {
    const remaining = this.readAll(businessId).filter((entry) => entry.id !== id);
    this.writeAll(businessId, remaining);
  }
}

export const localStorageSalesDataSource = new LocalStorageSalesDataSource();

import type { CartItem } from '@rdplatforms/contexts';

function key(businessId: string): string {
  return `rdplatforms:cart:${businessId}`;
}

/** Namespaced per business — a customer never sees another business's cart. */
export function readCart(businessId: string): CartItem[] {
  try {
    const raw = localStorage.getItem(key(businessId));
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(businessId: string, items: CartItem[]): void {
  try {
    localStorage.setItem(key(businessId), JSON.stringify(items));
  } catch {
    // Best-effort — a private-browsing tab or a full quota shouldn't crash the page, just not persist.
  }
}

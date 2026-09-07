import type { NewSale, Sale } from '@rdplatforms/types';

function baseUrl(): string {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (!url) {
    throw new Error('VITE_API_BASE_URL is not set — the portal has no backend to call.');
  }
  return url;
}

function authHeaders(token: string): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

/** Thrown by listSales specifically for a 403 — see SaleController's own comment on why GET is gated beyond "just a member" (Owner/Super Admin, or Staff with canViewFullAnalytics). Callers use this to distinguish "you don't have the permission" from a real failure. */
export class SalesAccessDeniedError extends Error {}

/**
 * Same reasoning as staffApi.ts/bookingsApi.ts: direct fetch calls
 * against the backend's auth-scoped write endpoints, not
 * @rdplatforms/services' *DataSource pattern (that's for the public
 * site's read-only content).
 */
export async function listSales(token: string, businessId: string): Promise<Sale[]> {
  const res = await fetch(`${baseUrl()}/businesses/${encodeURIComponent(businessId)}/sales`, {
    headers: authHeaders(token),
  });
  if (res.status === 403) {
    throw new SalesAccessDeniedError('Full sales access requires the Owner role or the analytics permission.');
  }
  if (!res.ok) {
    throw new Error('Failed to load sales.');
  }
  return res.json();
}

export async function createSale(token: string, businessId: string, input: NewSale): Promise<Sale> {
  const res = await fetch(`${baseUrl()}/businesses/${encodeURIComponent(businessId)}/sales`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    throw new Error(body?.message ?? 'Failed to create sale.');
  }
  return res.json();
}

import type { Business, BusinessCategory } from '@rdplatforms/types';

export interface NewBusiness {
  slug: string;
  displayName: string;
  legalName: string;
  category: BusinessCategory;
  phone: string;
}

export interface NewOwner {
  email: string;
  password: string;
  displayName: string;
}

function baseUrl(): string {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (!url) {
    throw new Error('VITE_API_BASE_URL is not set — the admin app has no backend to call.');
  }
  return url;
}

function authHeaders(token: string): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

async function readErrorMessage(res: Response, fallback: string): Promise<string> {
  const body = await res.json().catch(() => undefined);
  return body?.message ?? fallback;
}

/**
 * GET /businesses is public (BusinessController — matches every other
 * business's own read-only content endpoints), so this technically
 * doesn't need a token — sent anyway for consistency with every other
 * *Api.ts in this codebase (staffApi.ts, productsApi.ts, ...) and
 * because a real admin session always has one.
 */
export async function listBusinesses(token: string): Promise<Business[]> {
  const res = await fetch(`${baseUrl()}/businesses`, { headers: authHeaders(token) });
  if (!res.ok) {
    throw new Error('Failed to load businesses.');
  }
  return res.json();
}

export async function createBusiness(token: string, input: NewBusiness): Promise<Business> {
  const res = await fetch(`${baseUrl()}/businesses`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res, 'Failed to create business.'));
  }
  return res.json();
}

export async function updateBusinessStatus(
  token: string,
  businessId: string,
  isActive: boolean,
): Promise<Business> {
  const res = await fetch(`${baseUrl()}/businesses/${encodeURIComponent(businessId)}/status`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ isActive }),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res, 'Failed to update business status.'));
  }
  return res.json();
}

export async function createOwner(token: string, businessId: string, input: NewOwner): Promise<void> {
  const res = await fetch(`${baseUrl()}/businesses/${encodeURIComponent(businessId)}/owners`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res, 'Failed to create owner.'));
  }
}

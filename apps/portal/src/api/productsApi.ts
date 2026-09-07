import type { NewProduct, Product } from '@rdplatforms/types';

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

/** Same direct-fetch pattern as staffApi.ts/bookingsApi.ts/salesApi.ts. Owner-only server-side (ProductController.requireOwner) — a Staff member calling these gets a 403. */
export async function listProducts(token: string, businessId: string): Promise<Product[]> {
  const res = await fetch(`${baseUrl()}/businesses/${encodeURIComponent(businessId)}/products`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    throw new Error('Failed to load products.');
  }
  return res.json();
}

export async function createProduct(token: string, businessId: string, input: NewProduct): Promise<Product> {
  const res = await fetch(`${baseUrl()}/businesses/${encodeURIComponent(businessId)}/products`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    throw new Error(body?.message ?? 'Failed to create product.');
  }
  return res.json();
}

export async function updateProduct(
  token: string,
  businessId: string,
  productId: string,
  input: NewProduct,
): Promise<Product> {
  const res = await fetch(
    `${baseUrl()}/businesses/${encodeURIComponent(businessId)}/products/${encodeURIComponent(productId)}`,
    { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify(input) },
  );
  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    throw new Error(body?.message ?? 'Failed to update product.');
  }
  return res.json();
}

export async function deleteProduct(token: string, businessId: string, productId: string): Promise<void> {
  const res = await fetch(
    `${baseUrl()}/businesses/${encodeURIComponent(businessId)}/products/${encodeURIComponent(productId)}`,
    { method: 'DELETE', headers: authHeaders(token) },
  );
  if (!res.ok) {
    throw new Error('Failed to delete product.');
  }
}

export interface StaffMember {
  membershipId: string;
  userId: string;
  email: string;
  displayName: string;
  canViewFullAnalytics: boolean;
}

export interface CreateStaffInput {
  email: string;
  password: string;
  displayName: string;
  canViewFullAnalytics: boolean;
}

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

/**
 * Thin, direct fetch wrappers around the backend's Owner-only staff
 * endpoints (see backend's StaffController) — deliberately not routed
 * through @rdplatforms/services' *DataSource pattern, which is for the
 * public, read-only content every business exposes. This is
 * auth-scoped, write-capable, and portal-specific, same reasoning as
 * AuthProvider's own direct fetch calls.
 */
export async function listStaff(token: string, businessId: string): Promise<StaffMember[]> {
  const res = await fetch(`${baseUrl()}/businesses/${encodeURIComponent(businessId)}/staff`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    throw new Error('Failed to load staff.');
  }
  return res.json();
}

export async function createStaff(
  token: string,
  businessId: string,
  input: CreateStaffInput,
): Promise<StaffMember> {
  const res = await fetch(`${baseUrl()}/businesses/${encodeURIComponent(businessId)}/staff`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error('Failed to create staff member.');
  }
  return res.json();
}

export async function updateStaffAnalyticsAccess(
  token: string,
  businessId: string,
  membershipId: string,
  canViewFullAnalytics: boolean,
): Promise<void> {
  const res = await fetch(
    `${baseUrl()}/businesses/${encodeURIComponent(businessId)}/staff/${encodeURIComponent(membershipId)}`,
    {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify({ canViewFullAnalytics }),
    },
  );
  if (!res.ok) {
    throw new Error('Failed to update staff member.');
  }
}

export async function removeStaff(
  token: string,
  businessId: string,
  membershipId: string,
): Promise<void> {
  const res = await fetch(
    `${baseUrl()}/businesses/${encodeURIComponent(businessId)}/staff/${encodeURIComponent(membershipId)}`,
    { method: 'DELETE', headers: authHeaders(token) },
  );
  if (!res.ok) {
    throw new Error('Failed to remove staff member.');
  }
}

const TOKEN_STORAGE_KEY = 'rdplatforms:portal:token';

export interface JwtMembership {
  businessId: string;
  role: 'OWNER' | 'STAFF';
  canViewFullAnalytics: boolean;
}

export interface JwtPayload {
  sub: string;
  email: string;
  superAdmin: boolean;
  memberships: JwtMembership[];
  exp: number;
}

/**
 * Same tradeoff as apps/admin/src/auth/adminAuth.ts (localStorage bearer
 * token, XSS-token-theft risk accepted for now — see that file's
 * comment). Namespaced separately ("portal" not "admin") so the two
 * apps' tokens never collide if ever loaded in the same browser profile.
 */
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

/** Decodes the payload without verifying the signature — display-only; the backend is the real authority. */
export function decodeJwtPayload(token: string): JwtPayload | undefined {
  try {
    const [, payloadSegment] = token.split('.');
    if (!payloadSegment) {
      return undefined;
    }
    const json = atob(payloadSegment.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return undefined;
  }
}

export function isExpired(payload: JwtPayload): boolean {
  return payload.exp * 1000 <= Date.now();
}

export function hasMembership(payload: JwtPayload, businessId: string): boolean {
  return payload.superAdmin || payload.memberships.some((m) => m.businessId === businessId);
}

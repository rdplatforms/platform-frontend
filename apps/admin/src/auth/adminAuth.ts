const TOKEN_STORAGE_KEY = 'rdplatforms:admin:token';

export interface JwtPayload {
  sub: string;
  email: string;
  superAdmin: boolean;
  exp: number;
}

/**
 * Stored in localStorage, not sessionStorage — an admin closing/reopening
 * a tab shouldn't force a re-login; the token's own server-issued
 * expiration (app.jwt.expiration-minutes in the backend) is the actual
 * security boundary, not the storage mechanism. Same standard tradeoff
 * as any bearer-token-in-browser-storage design (vulnerable to XSS token
 * theft, same as this repo's existing dashboard passcode) — an httpOnly
 * cookie would remove that class of risk but is a bigger shift, not in
 * scope for TASK-008.
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

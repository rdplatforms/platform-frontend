import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  clearStoredToken,
  decodeJwtPayload,
  getStoredToken,
  isExpired,
  setStoredToken,
} from './portalAuth';
import { AuthContext, type AuthContextValue } from './authContext';

/** Frequent enough that expiry is caught well within a session, cheap enough (pure client-side decode, no network) to not matter. */
const EXPIRY_CHECK_INTERVAL_MS = 30_000;

function initialToken(): string | null {
  const stored = getStoredToken();
  if (!stored) {
    return null;
  }
  const payload = decodeJwtPayload(stored);
  if (!payload || isExpired(payload)) {
    clearStoredToken();
    return null;
  }
  return stored;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(initialToken);

  const login = useCallback(async (email: string, password: string) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!baseUrl) {
      throw new Error('VITE_API_BASE_URL is not set — the portal has no backend to call.');
    }
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      throw new Error('Invalid email or password.');
    }
    const { token: newToken } = (await res.json()) as { token: string };
    setStoredToken(newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
  }, []);

  /**
   * Before this, token expiry was only ever checked once, at app load
   * (initialToken above) — a session left open past expiration stayed
   * "logged in" in the UI until the next full reload, and every API
   * call in the meantime failed with a generic error instead of
   * prompting re-login (found in a retrospective audit). Polling is a
   * deliberately simple fix over wiring 401-detection into every
   * fetch call site (staffApi/bookingsApi/salesApi/productsApi) —
   * logout() here flips isAuthenticated to false, which RequireAuth
   * already turns into a redirect to /login with no further plumbing.
   */
  useEffect(() => {
    if (!token) {
      return;
    }
    const interval = setInterval(() => {
      const payload = decodeJwtPayload(token);
      if (!payload || isExpired(payload)) {
        logout();
      }
    }, EXPIRY_CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [token, logout]);

  const user = useMemo(() => (token ? decodeJwtPayload(token) : undefined), [token]);

  const value = useMemo<AuthContextValue>(
    () => ({ token, user, isAuthenticated: Boolean(token), login, logout }),
    [token, user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

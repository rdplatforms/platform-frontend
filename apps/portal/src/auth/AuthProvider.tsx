import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  clearStoredToken,
  decodeJwtPayload,
  getStoredToken,
  isExpired,
  setStoredToken,
} from './portalAuth';
import { AuthContext, type AuthContextValue } from './authContext';

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

  const user = useMemo(() => (token ? decodeJwtPayload(token) : undefined), [token]);

  const value = useMemo<AuthContextValue>(
    () => ({ token, user, isAuthenticated: Boolean(token), login, logout }),
    [token, user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

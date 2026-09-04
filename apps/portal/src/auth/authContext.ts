import { createContext, useContext } from 'react';
import type { JwtPayload } from './portalAuth';

export interface AuthContextValue {
  token: string | null;
  user: JwtPayload | undefined;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return value;
}

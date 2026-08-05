import { createContext, useContext } from 'react';
import type { Business } from '@rdplatforms/types';

export interface BusinessContextValue {
  business: Business | undefined;
  isLoading: boolean;
  error: Error | undefined;
}

/**
 * Deliberately has no default value: any component reading this outside of
 * <BusinessProvider> (see @rdplatforms/providers) is a wiring bug, and
 * useBusinessContext() below turns that into a loud error instead of a
 * silent undefined.
 */
export const BusinessContext = createContext<BusinessContextValue | undefined>(undefined);

export function useBusinessContext(): BusinessContextValue {
  const value = useContext(BusinessContext);
  if (!value) {
    throw new Error('useBusinessContext must be used within a <BusinessProvider>');
  }
  return value;
}

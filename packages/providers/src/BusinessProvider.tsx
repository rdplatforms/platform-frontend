import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Business } from '@rdplatforms/types';
import { businessResolver } from '@rdplatforms/business';
import { BusinessContext, type BusinessContextValue } from '@rdplatforms/contexts';

export interface BusinessProviderProps {
  children: ReactNode;
  /** Overrides automatic resolution — primarily for tests and Storybook-style previews. */
  overrideBusiness?: Business;
}

function readBrowserResolutionContext() {
  if (typeof window === 'undefined') {
    return {};
  }
  const params = new URLSearchParams(window.location.search);
  return {
    hostname: window.location.hostname,
    queryParamSlug: params.get('business') ?? undefined,
    envDefaultSlug: import.meta.env.VITE_DEFAULT_BUSINESS_SLUG as string | undefined,
  };
}

/**
 * Resolves "which business is this?" exactly once per app load and makes the
 * result available via useBusinessContext(). Every business-aware component
 * downstream (theme, sections, contact info) reads from this — none of them
 * talk to BusinessResolver or BusinessService directly.
 */
export function BusinessProvider({ children, overrideBusiness }: BusinessProviderProps) {
  const [business, setBusiness] = useState<Business | undefined>(overrideBusiness);
  const [isLoading, setIsLoading] = useState(!overrideBusiness);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (overrideBusiness) {
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    businessResolver
      .resolve(readBrowserResolutionContext())
      .then((resolved) => {
        if (cancelled) return;
        if (!resolved) {
          setError(new Error('Unable to resolve a business for this request.'));
        }
        setBusiness(resolved);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error('Unknown business resolution error'));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [overrideBusiness]);

  const value = useMemo<BusinessContextValue>(
    () => ({ business, isLoading, error }),
    [business, isLoading, error],
  );

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

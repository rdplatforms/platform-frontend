import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { SupportedLocale } from '@rdplatforms/types';
import { LocaleContext, type LocaleContextValue, useBusinessContext } from '@rdplatforms/contexts';

function storageKey(businessId: string): string {
  return `rdplatforms:locale:${businessId}`;
}

export interface LocaleProviderProps {
  children: ReactNode;
}

/**
 * Must sit inside <BusinessProvider> — the resolved business is what
 * determines which locales are even available (its `supportedLocales`,
 * first entry = default). A single-language business never sees a
 * switcher because `availableLocales` only ever has one entry.
 */
export function LocaleProvider({ children }: LocaleProviderProps) {
  const { business } = useBusinessContext();
  const availableLocales = useMemo<SupportedLocale[]>(
    () => business?.supportedLocales ?? ['en'],
    [business],
  );

  const [locale, setLocaleState] = useState<SupportedLocale>(availableLocales[0] ?? 'en');

  useEffect(() => {
    if (!business) {
      return;
    }
    const stored = window.localStorage.getItem(storageKey(business.id)) as SupportedLocale | null;
    setLocaleState(
      stored && availableLocales.includes(stored) ? stored : (availableLocales[0] ?? 'en'),
    );
  }, [business, availableLocales]);

  const setLocale = useCallback(
    (next: SupportedLocale) => {
      setLocaleState(next);
      if (business) {
        window.localStorage.setItem(storageKey(business.id), next);
      }
    },
    [business],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, availableLocales, setLocale }),
    [locale, availableLocales, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

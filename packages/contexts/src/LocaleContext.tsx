import { createContext, useContext } from 'react';
import type { SupportedLocale } from '@rdplatforms/types';

export interface LocaleContextValue {
  locale: SupportedLocale;
  availableLocales: SupportedLocale[];
  setLocale: (locale: SupportedLocale) => void;
}

export const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function useLocaleContext(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error('useLocaleContext must be used within a <LocaleProvider>');
  }
  return value;
}

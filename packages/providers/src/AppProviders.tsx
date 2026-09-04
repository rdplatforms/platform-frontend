import type { ReactNode } from 'react';
import type { Business } from '@rdplatforms/types';
import { BusinessProvider, type BusinessProviderProps } from './BusinessProvider';
import { LocaleProvider } from './LocaleProvider';
import { AppThemeProvider } from './AppThemeProvider';
import { QueryProvider } from './QueryProvider';

export interface AppProvidersProps {
  children: ReactNode;
  overrideBusiness?: Business;
  /** apps/portal passes portalBusinessResolver — see BusinessProviderProps. */
  resolver?: BusinessProviderProps['resolver'];
}

/**
 * Single composition root for apps/website and apps/portal (apps/admin
 * manages many businesses at once, so it deliberately runs its own fixed
 * theme instead — see docs/future-admin.md). Order matters: QueryProvider
 * has no dependents here but sits outermost for future hooks;
 * BusinessProvider must resolve before LocaleProvider (which reads the
 * resolved business's supportedLocales) or AppThemeProvider can read it.
 */
export function AppProviders({ children, overrideBusiness, resolver }: AppProvidersProps) {
  return (
    <QueryProvider>
      <BusinessProvider overrideBusiness={overrideBusiness} resolver={resolver}>
        <LocaleProvider>
          <AppThemeProvider>{children}</AppThemeProvider>
        </LocaleProvider>
      </BusinessProvider>
    </QueryProvider>
  );
}

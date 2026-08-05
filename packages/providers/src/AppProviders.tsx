import type { ReactNode } from 'react';
import type { Business } from '@rdplatforms/types';
import { BusinessProvider } from './BusinessProvider';
import { AppThemeProvider } from './AppThemeProvider';
import { QueryProvider } from './QueryProvider';

export interface AppProvidersProps {
  children: ReactNode;
  overrideBusiness?: Business;
}

/**
 * Single composition root for apps/website and apps/admin. Order matters:
 * QueryProvider has no dependents here but sits outermost for future hooks;
 * BusinessProvider must resolve before AppThemeProvider can read it.
 */
export function AppProviders({ children, overrideBusiness }: AppProvidersProps) {
  return (
    <QueryProvider>
      <BusinessProvider overrideBusiness={overrideBusiness}>
        <AppThemeProvider>{children}</AppThemeProvider>
      </BusinessProvider>
    </QueryProvider>
  );
}

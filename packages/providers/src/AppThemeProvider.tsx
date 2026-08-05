import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { BusinessTheme } from '@rdplatforms/types';
import { themeService } from '@rdplatforms/services';
import { useBusinessContext } from '@rdplatforms/contexts';
import { createAppTheme } from './theme/createAppTheme';

export interface AppThemeProviderProps {
  children: ReactNode;
}

/**
 * Loads the resolved business's BusinessTheme and derives an MUI theme from
 * it via the theme engine (createAppTheme). Renders children immediately
 * with the default theme while the business theme loads, then swaps in
 * place — there is no separate "theme loading" screen.
 */
export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const { business } = useBusinessContext();
  const [businessTheme, setBusinessTheme] = useState<BusinessTheme | undefined>(undefined);

  useEffect(() => {
    if (!business) {
      return;
    }
    let cancelled = false;
    themeService.getByBusiness(business.id).then((theme) => {
      if (!cancelled) {
        setBusinessTheme(theme);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [business]);

  const theme = useMemo(() => createAppTheme(businessTheme), [businessTheme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

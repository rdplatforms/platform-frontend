import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { BusinessTheme } from '@rdplatforms/types';
import { themeService } from '@rdplatforms/services';
import { useBusinessContext, useLocaleContext } from '@rdplatforms/contexts';
import { createAppTheme } from './theme/createAppTheme';
import { loadGoogleFont } from './theme/loadGoogleFont';

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
  const { locale } = useLocaleContext();
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

  useEffect(() => {
    loadGoogleFont(businessTheme?.typography.googleFontsUrl);
  }, [businessTheme]);

  const theme = useMemo(() => createAppTheme(businessTheme, locale), [businessTheme, locale]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@rdplatforms/providers';
import { portalBusinessResolver } from '@rdplatforms/business';
import { AuthProvider } from './auth/AuthProvider';
import { router } from './routes/router';

/**
 * Unlike apps/admin (many businesses, one fixed theme), the portal is
 * scoped to exactly one business per hostname — same shape as
 * apps/website, just resolved via Business.portalDomains instead of
 * Business.domains (portalBusinessResolver, see @rdplatforms/business).
 * That's also why it gets the real per-business theme via AppProviders
 * (which already renders MUI's ThemeProvider + CssBaseline internally).
 */
export function App() {
  return (
    <AppProviders resolver={portalBusinessResolver}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AppProviders>
  );
}

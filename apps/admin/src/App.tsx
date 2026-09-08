import { useEffect } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { loadGoogleAnalytics } from '@rdplatforms/utils';
import { AuthProvider } from './auth/AuthProvider';
import { router } from './routes/router';

/**
 * The admin operates across every business at once, so it deliberately does
 * not use the per-business theme engine from @rdplatforms/providers — it
 * has its own fixed platform theme.
 */
const adminTheme = createTheme({
  palette: { mode: 'light', primary: { main: '#1B1F3B' } },
  shape: { borderRadius: 8 },
});

export function App() {
  useEffect(() => {
    const id = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
    if (!id) {
      return;
    }
    return loadGoogleAnalytics(id);
  }, []);

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

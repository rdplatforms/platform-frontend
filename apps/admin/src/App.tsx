import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
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
  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

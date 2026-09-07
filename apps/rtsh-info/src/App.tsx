import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';

/**
 * A platform-owned product (personal cards, not a per-tenant business
 * site), so this deliberately does not use @rdplatforms/providers' per-
 * business theme engine — one fixed look for every card, same reasoning
 * as apps/admin's own fixed theme.
 */
const cardTheme = createTheme({
  palette: { mode: 'light', primary: { main: '#1B1F3B' } },
  shape: { borderRadius: 16 },
});

export function App() {
  return (
    <ThemeProvider theme={cardTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

import { lazy, Suspense, type ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { createBrowserRouter } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })));
const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

const routeFallback = (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
    <CircularProgress />
  </Box>
);

function withSuspense(element: ReactNode) {
  return <Suspense fallback={routeFallback}>{element}</Suspense>;
}

/**
 * Every business today only has a single "/" page (see static-data/pages.json),
 * so this stays intentionally small. Adding a second page for a business is
 * a PageConfig entry plus a route here — not a new app. Routes are lazy
 * (see docs/frontend-architecture.md#performance) so page code splits out
 * of the main bundle rather than the vendor libraries a page happens to use.
 */
export const router = createBrowserRouter([
  { path: '/', element: withSuspense(<HomePage />) },
  { path: '*', element: withSuspense(<NotFoundPage />) },
]);

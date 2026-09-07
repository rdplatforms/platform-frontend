import { lazy, Suspense, type ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { createBrowserRouter } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })));
const CartPage = lazy(() => import('../pages/CartPage').then((m) => ({ default: m.CartPage })));
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
 *
 * The interim /dashboard route (localStorage-backed sales logging, see
 * ADR 0007) was removed once apps/portal's real Billing/Analytics pages
 * (TASKS.md Milestone 5) covered the same job for real — see ADR 0012.
 *
 * /cart (Milestone 6) is the one dedicated route the shop section
 * needs, not a page section itself — "add to cart" happens inline in
 * the Shop section, but reviewing/editing the cart and checking out
 * needs its own page, same reasoning docs/shop.md gives in full.
 */
export const router = createBrowserRouter([
  { path: '/', element: withSuspense(<HomePage />) },
  { path: '/cart', element: withSuspense(<CartPage />) },
  { path: '*', element: withSuspense(<NotFoundPage />) },
]);

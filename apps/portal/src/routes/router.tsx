import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../auth/LoginPage';
import { RequireAuth } from '../auth/RequireAuth';
import { PortalLayout } from '../layout/PortalLayout';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { BillingPage } from '../pages/BillingPage';
import { BookingsPage } from '../pages/BookingsPage';
import { DashboardPage } from '../pages/DashboardPage';
import { StaffPage } from '../pages/StaffPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <PortalLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'bookings', element: <BookingsPage /> },
      { path: 'billing', element: <BillingPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'staff', element: <StaffPage /> },
    ],
  },
]);

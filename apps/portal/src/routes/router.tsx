import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../auth/LoginPage';
import { RequireAuth } from '../auth/RequireAuth';
import { PortalLayout } from '../layout/PortalLayout';
import { DashboardPage } from '../pages/DashboardPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <PortalLayout />
      </RequireAuth>
    ),
    children: [{ index: true, element: <DashboardPage /> }],
  },
]);

import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../auth/LoginPage';
import { RequireAuth } from '../auth/RequireAuth';
import { AdminLayout } from '../layout/AdminLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { PagesPage } from '../pages/PagesPage';
import { MediaPage } from '../pages/MediaPage';
import { ServicesPage } from '../pages/ServicesPage';
import { BusinessPage } from '../pages/BusinessPage';
import { ThemePage } from '../pages/ThemePage';
import { UsersPage } from '../pages/UsersPage';
import { SettingsPage } from '../pages/SettingsPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'pages', element: <PagesPage /> },
      { path: 'media', element: <MediaPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'business', element: <BusinessPage /> },
      { path: 'theme', element: <ThemePage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);

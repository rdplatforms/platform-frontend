import { createBrowserRouter } from 'react-router-dom';
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
  {
    path: '/',
    element: <AdminLayout />,
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

import { createBrowserRouter } from 'react-router-dom';
import { CardPage } from '../pages/CardPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  { path: '/:identifier', element: <CardPage /> },
  { path: '*', element: <NotFoundPage /> },
]);

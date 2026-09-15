import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { CardPage } from '../pages/CardPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/:identifier', element: <CardPage /> },
  { path: '*', element: <NotFoundPage /> },
]);

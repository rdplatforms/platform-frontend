import { RouterProvider } from 'react-router-dom';
import { AppProviders, CartProvider } from '@rdplatforms/providers';
import { BusinessGate } from './components/BusinessGate';
import { DocumentHead } from './seo/DocumentHead';
import { router } from './routes/router';

export function App() {
  return (
    <AppProviders>
      <BusinessGate>
        <CartProvider>
          <DocumentHead />
          <RouterProvider router={router} />
        </CartProvider>
      </BusinessGate>
    </AppProviders>
  );
}

import { RouterProvider } from 'react-router-dom';
import { AppProviders, CartProvider } from '@rdplatforms/providers';
import { GoogleAnalytics } from './analytics/GoogleAnalytics';
import { BusinessGate } from './components/BusinessGate';
import { DocumentHead } from './seo/DocumentHead';
import { router } from './routes/router';

export function App() {
  return (
    <AppProviders>
      <BusinessGate>
        <CartProvider>
          <DocumentHead />
          <GoogleAnalytics />
          <RouterProvider router={router} />
        </CartProvider>
      </BusinessGate>
    </AppProviders>
  );
}

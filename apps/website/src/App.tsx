import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@rdplatforms/providers';
import { BusinessGate } from './components/BusinessGate';
import { DocumentHead } from './seo/DocumentHead';
import { router } from './routes/router';

export function App() {
  return (
    <AppProviders>
      <BusinessGate>
        <DocumentHead />
        <RouterProvider router={router} />
      </BusinessGate>
    </AppProviders>
  );
}

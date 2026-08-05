import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Wired in now even though today's JsonDataSource has no network latency or
 * cache-invalidation concerns — this is what every content hook in
 * @rdplatforms/hooks already queries through, so swapping the data source
 * for a real REST API later requires zero changes here.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

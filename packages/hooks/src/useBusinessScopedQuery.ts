import { useQuery, type UseQueryResult } from '@tanstack/react-query';

/**
 * Shared shape for every "fetch this content collection for the current
 * business" hook. Centralizing it here means adding a new content type
 * (e.g. useTeam) is a five-line file, not a new copy of loading/error
 * handling. Disabled automatically until a businessId is known so hooks can
 * be called before business resolution finishes without firing bad requests.
 */
export function useBusinessScopedQuery<T>(
  queryKey: string,
  fetcher: (businessId: string) => Promise<T>,
  businessId: string | undefined,
): UseQueryResult<T> {
  return useQuery({
    queryKey: [queryKey, businessId],
    queryFn: () => fetcher(businessId as string),
    enabled: Boolean(businessId),
  });
}

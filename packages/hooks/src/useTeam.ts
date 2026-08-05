import { teamService } from '@rdplatforms/services';
import { useBusinessScopedQuery } from './useBusinessScopedQuery';

export function useTeam(businessId: string | undefined) {
  return useBusinessScopedQuery('team', (id) => teamService.getByBusiness(id), businessId);
}

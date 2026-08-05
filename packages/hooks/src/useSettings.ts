import { settingsService } from '@rdplatforms/services';
import { useBusinessScopedQuery } from './useBusinessScopedQuery';

export function useSettings(businessId: string | undefined) {
  return useBusinessScopedQuery('settings', (id) => settingsService.getByBusiness(id), businessId);
}

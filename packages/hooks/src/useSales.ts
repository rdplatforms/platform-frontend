import { salesService } from '@rdplatforms/services';
import { useBusinessScopedQuery } from './useBusinessScopedQuery';

export function useSales(businessId: string | undefined) {
  return useBusinessScopedQuery('sales', (id) => salesService.getByBusiness(id), businessId);
}

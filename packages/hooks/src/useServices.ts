import { serviceCatalogService } from '@rdplatforms/services';
import { useBusinessScopedQuery } from './useBusinessScopedQuery';

export function useServices(businessId: string | undefined) {
  return useBusinessScopedQuery(
    'services',
    (id) => serviceCatalogService.getByBusiness(id),
    businessId,
  );
}

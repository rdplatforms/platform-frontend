import { seoService } from '@rdplatforms/services';
import { useBusinessScopedQuery } from './useBusinessScopedQuery';

export function useSeo(businessId: string | undefined) {
  return useBusinessScopedQuery('seo', (id) => seoService.getByBusiness(id), businessId);
}

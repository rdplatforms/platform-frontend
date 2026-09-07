import { productService } from '@rdplatforms/services';
import { useBusinessScopedQuery } from './useBusinessScopedQuery';

export function useProducts(businessId: string | undefined) {
  return useBusinessScopedQuery('products', (id) => productService.getByBusiness(id), businessId);
}

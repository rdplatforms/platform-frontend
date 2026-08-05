import { galleryService } from '@rdplatforms/services';
import { useBusinessScopedQuery } from './useBusinessScopedQuery';

export function useGallery(businessId: string | undefined) {
  return useBusinessScopedQuery('gallery', (id) => galleryService.getByBusiness(id), businessId);
}

import { testimonialService } from '@rdplatforms/services';
import { useBusinessScopedQuery } from './useBusinessScopedQuery';

export function useTestimonials(businessId: string | undefined) {
  return useBusinessScopedQuery(
    'testimonials',
    (id) => testimonialService.getByBusiness(id),
    businessId,
  );
}

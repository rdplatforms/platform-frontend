import { faqService } from '@rdplatforms/services';
import { useBusinessScopedQuery } from './useBusinessScopedQuery';

export function useFaqs(businessId: string | undefined) {
  return useBusinessScopedQuery('faqs', (id) => faqService.getByBusiness(id), businessId);
}

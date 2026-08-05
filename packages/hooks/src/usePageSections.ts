import { useQuery } from '@tanstack/react-query';
import { pageService } from '@rdplatforms/services';

export function usePageSections(businessId: string | undefined, path: string = '/') {
  return useQuery({
    queryKey: ['page-sections', businessId, path],
    queryFn: () => pageService.getEnabledSections(businessId as string, path),
    enabled: Boolean(businessId),
  });
}

import { useMutation } from '@tanstack/react-query';
import type { ContactMessageDetails } from '@rdplatforms/utils';
import { contactService } from '@rdplatforms/services';

/** Best-effort — see ContactService's own comment. No cache to invalidate: nothing reads contact messages back yet. */
export function useCreateContactMessage(businessId: string) {
  return useMutation({
    mutationFn: (input: ContactMessageDetails) => contactService.createContactMessage(businessId, input),
  });
}

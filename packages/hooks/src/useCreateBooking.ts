import { useMutation } from '@tanstack/react-query';
import type { NewBooking } from '@rdplatforms/types';
import { bookingService } from '@rdplatforms/services';

/**
 * Best-effort — see BookingService's own comment. No cache to
 * invalidate: nothing on the public website reads the booking list back
 * (that's apps/portal's job — see TASK-015).
 */
export function useCreateBooking(businessId: string) {
  return useMutation({
    mutationFn: (input: NewBooking) => bookingService.createBooking(businessId, input),
  });
}

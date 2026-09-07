import { useMutation } from '@tanstack/react-query';
import type { NewSale } from '@rdplatforms/types';
import { checkoutService } from '@rdplatforms/services';

/** Unlike useCreateBooking, NOT best-effort — see CheckoutService's own comment. Rejects visibly so CartPage can show a real error. */
export function useCheckout(businessId: string) {
  return useMutation({
    mutationFn: (input: NewSale) => checkoutService.createSale(businessId, input),
  });
}

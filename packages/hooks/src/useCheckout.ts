import { useMutation } from '@tanstack/react-query';
import type { NewSale } from '@rdplatforms/types';
import { checkoutService } from '@rdplatforms/services';

/** Rejects on failure/no-backend, same as CheckoutService — CartPage is what makes this best-effort (awaits, swallows, always sends WhatsApp regardless). See CheckoutService's own comment. */
export function useCheckout(businessId: string) {
  return useMutation({
    mutationFn: (input: NewSale) => checkoutService.createSale(businessId, input),
  });
}

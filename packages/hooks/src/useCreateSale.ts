import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { NewSaleEntry } from '@rdplatforms/types';
import { salesService } from '@rdplatforms/services';

export function useCreateSale(businessId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewSaleEntry) => salesService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales', businessId] });
    },
  });
}

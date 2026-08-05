import { useMutation, useQueryClient } from '@tanstack/react-query';
import { salesService } from '@rdplatforms/services';

export function useDeleteSale(businessId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => salesService.remove(id, businessId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales', businessId] });
    },
  });
}

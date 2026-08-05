import { useBusinessContext } from '@rdplatforms/contexts';

/**
 * The one hook nearly every component needs: the currently resolved
 * business plus its resolution status. Thin on purpose — all resolution
 * logic lives in @rdplatforms/business and @rdplatforms/providers.
 */
export function useBusiness() {
  return useBusinessContext();
}

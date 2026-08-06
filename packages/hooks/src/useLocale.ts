import { useLocaleContext } from '@rdplatforms/contexts';

/**
 * The current visitor-selected locale plus what's actually available for
 * this business. Combine with resolveLocalizedText (@rdplatforms/utils)
 * to render a LocalizableText field.
 */
export function useLocale() {
  return useLocaleContext();
}

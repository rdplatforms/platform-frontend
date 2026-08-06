import type { LocalizableText, SupportedLocale } from '@rdplatforms/types';

/**
 * A plain string passes through untouched (the vast majority of
 * businesses, which are single-language). A LocalizedText object resolves
 * to the requested locale, falling back to English, then to whichever
 * translation actually exists, so a partially-translated field never
 * renders blank.
 */
export function resolveLocalizedText(
  value: LocalizableText | undefined,
  locale: SupportedLocale,
): string {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  return value[locale] ?? value.en ?? Object.values(value).find(Boolean) ?? '';
}

/**
 * The platform supports per-business bilingual content. A business with a
 * single language (the common case) just uses plain strings everywhere —
 * nothing below is required. A bilingual business opts in by setting
 * `Business.supportedLocales` and using `LocalizedText` objects on its
 * content fields.
 */
export type SupportedLocale = 'en' | 'mr';

export interface LocalizedText {
  en?: string;
  mr?: string;
}

/** Every content field that can be localized accepts either shape. */
export type LocalizableText = string | LocalizedText;

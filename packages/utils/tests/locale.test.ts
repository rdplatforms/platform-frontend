import { describe, expect, it } from 'vitest';
import { resolveLocalizedText } from '../src/locale';
import { getAboutHeading, translateUi } from '../src/uiStrings';

describe('resolveLocalizedText', () => {
  it('passes a plain string through untouched', () => {
    expect(resolveLocalizedText('Haircut', 'mr')).toBe('Haircut');
  });

  it('resolves the requested locale from a localized object', () => {
    expect(resolveLocalizedText({ en: 'Haircut', mr: 'हेअर कटिंग' }, 'mr')).toBe('हेअर कटिंग');
  });

  it('falls back to English when the requested locale is missing', () => {
    expect(resolveLocalizedText({ en: 'Haircut' }, 'mr')).toBe('Haircut');
  });

  it('falls back to any present translation when English is also missing', () => {
    expect(resolveLocalizedText({ mr: 'हेअर कटिंग' }, 'en')).toBe('हेअर कटिंग');
  });

  it('returns an empty string for undefined', () => {
    expect(resolveLocalizedText(undefined, 'en')).toBe('');
  });
});

describe('translateUi', () => {
  it('returns the English string for the en locale', () => {
    expect(translateUi('ourServices', 'en')).toBe('Our Services');
  });

  it('returns the Marathi string for the mr locale', () => {
    expect(translateUi('ourServices', 'mr')).toBe('आमच्या सेवा');
  });
});

describe('getAboutHeading', () => {
  it('puts the business name before "About" in English', () => {
    expect(getAboutHeading('Swami Hair Salon', 'en')).toBe('About Swami Hair Salon');
  });

  it('puts the business name before विषयी in Marathi', () => {
    expect(getAboutHeading('स्वामी हेअर सलून', 'mr')).toBe('स्वामी हेअर सलून विषयी');
  });
});

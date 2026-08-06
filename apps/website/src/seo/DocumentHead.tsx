import { useEffect } from 'react';
import { useBusiness, useLocale, useSeo } from '@rdplatforms/hooks';
import { resolveLocalizedText } from '@rdplatforms/utils';

function setMetaTag(name: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/**
 * No react-helmet dependency needed for a single-page-per-business site —
 * this just imperatively syncs <title>, meta tags, and <html lang> whenever
 * SEO config or the visitor's chosen locale changes. Revisit if/when the
 * platform needs per-route SEO.
 */
export function DocumentHead() {
  const { business } = useBusiness();
  const { locale } = useLocale();
  const { data: seo } = useSeo(business?.id);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (!seo) {
      return;
    }
    document.title = resolveLocalizedText(seo.title, locale);
    setMetaTag('description', resolveLocalizedText(seo.description, locale));
    if (seo.keywords.length > 0) {
      setMetaTag('keywords', seo.keywords.join(', '));
    }
  }, [seo, locale]);

  return null;
}
